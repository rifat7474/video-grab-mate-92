import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DownloadRequest {
  url: string;
  format_id?: string;
  quality?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    const { url, format_id, quality }: DownloadRequest = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Download request for:', url, 'format:', format_id, 'quality:', quality)

    // Validate YouTube URL
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (!match) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid YouTube URL' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const videoId = match[1];

    // For now, use a third-party API service that provides YouTube download links
    // This is a temporary solution until yt-dlp can be properly installed
    try {
      const apiUrl = `https://api.cobalt.tools/api/json`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          vCodec: quality?.includes('kbps') ? 'mp3' : 'h264',
          vQuality: quality?.includes('kbps') ? '128' : quality?.replace('p', '') || '720',
          aFormat: quality?.includes('kbps') ? 'mp3' : 'mp4',
          filenamePattern: 'basic',
          isAudioOnly: quality?.includes('kbps') || false
        })
      });

      if (!response.ok) {
        throw new Error('External API failed');
      }

      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.text || 'Download failed');
      }

      if (data.status === 'success' && data.url) {
        return new Response(
          JSON.stringify({ 
            download_url: data.url,
            message: 'Download URL generated successfully'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

    } catch (apiError) {
      console.log('External API failed, falling back to direct YouTube link');
    }

    // Fallback: Generate a download URL based on the format
    let fallbackUrl = url;
    if (quality?.includes('kbps')) {
      // For audio, we'll provide a link to a YouTube to MP3 converter
      fallbackUrl = `https://ytmp3.cc/en13/${videoId}/`;
    } else {
      // For video, provide a link to a YouTube downloader
      fallbackUrl = `https://ssyoutube.com/watch?v=${videoId}`;
    }

    return new Response(
      JSON.stringify({ 
        download_url: fallbackUrl,
        message: 'Redirecting to download service',
        fallback: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing download request:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: 'The download service encountered an error. Please try again.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
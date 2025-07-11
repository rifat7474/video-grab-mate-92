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

    // Build yt-dlp command for getting download URL
    const args = [
      'yt-dlp',
      '--get-url',
      '--no-playlist'
    ];

    // Add format selection if specified
    if (format_id) {
      args.push('--format', format_id);
    } else if (quality) {
      if (quality.includes('kbps')) {
        // Audio format
        args.push('--format', 'bestaudio[ext=m4a]/bestaudio');
      } else {
        // Video format
        const height = quality.replace('p', '');
        args.push('--format', `best[height<=${height}]/best`);
      }
    } else {
      args.push('--format', 'best');
    }

    args.push(url);

    console.log('Running yt-dlp command:', args.join(' '));

    try {
      const ytDlpProcess = new Deno.Command('yt-dlp', {
        args: args.slice(1), // Remove 'yt-dlp' from args
        stdout: 'piped',
        stderr: 'piped',
      });

      const { code, stdout, stderr } = await ytDlpProcess.output();
      
      if (code !== 0) {
        const errorOutput = new TextDecoder().decode(stderr);
        console.error('yt-dlp error:', errorOutput);
        
        return new Response(
          JSON.stringify({ 
            error: 'Failed to get download URL', 
            details: 'The video might be private, restricted, or unavailable.' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const downloadUrl = new TextDecoder().decode(stdout).trim();
      
      if (!downloadUrl) {
        return new Response(
          JSON.stringify({ error: 'No download URL found' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('Successfully got download URL');

      // Return the direct download URL
      return new Response(
        JSON.stringify({ 
          download_url: downloadUrl,
          message: 'Download URL generated successfully'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (error) {
      console.error('Error running yt-dlp:', error);
      
      return new Response(
        JSON.stringify({ 
          error: 'Download service unavailable', 
          details: 'Please try again later or check if the video is available.' 
        }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

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
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UrlInput } from "@/components/video-downloader/UrlInput";
import { VideoPreview } from "@/components/video-downloader/VideoPreview";
import { DownloadOptions } from "@/components/video-downloader/DownloadOptions";
import { ProgressIndicator } from "@/components/video-downloader/ProgressIndicator";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { API_CONFIG, buildApiUrl } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

export interface VideoFormat {
  format_id: string;
  ext: string;
  quality: string;
  filesize?: number;
  url: string;
  resolution?: string;
  format_note?: string;
}

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  uploader: string;
  formats: VideoFormat[];
}

const Index = () => {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const { toast } = useToast();

  const handleUrlSubmit = async (inputUrl: string) => {
    setUrl(inputUrl);
    setLoading(true);
    setError("");
    setVideoInfo(null);

    try {
      console.log(`Calling Supabase function at: ${buildApiUrl(API_CONFIG.ENDPOINTS.FETCH_VIDEO_INFO)}`);
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FETCH_VIDEO_INFO), {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ url: inputUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.detail || 'Failed to fetch video information');
      }

      const videoData = await response.json();
      setVideoInfo(videoData);
      
      toast({
        title: "Success!",
        description: "Video information fetched successfully",
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch video information. Please check the URL and try again.";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: VideoFormat) => {
    setDownloadProgress(0);
    
    console.log(`Starting download for format:`, format);
    
    try {
      // For direct downloads, we'll use the URL from the format object
      // which should be a direct download link from the fetch-video-info function
      if (format.url && format.url.startsWith('http')) {
        // Create download link with proper filename
        const link = document.createElement('a');
        link.href = format.url;
        link.download = `${videoInfo?.title?.replace(/[^a-zA-Z0-9\s-_]/g, '') || 'video'}.${format.ext}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Download Started",
          description: "Your download should begin shortly",
        });

        // Simulate progress for UI feedback
        const interval = setInterval(() => {
          setDownloadProgress(prev => {
            if (prev === null || prev >= 100) {
              clearInterval(interval);
              setTimeout(() => setDownloadProgress(null), 2000);
              return 100;
            }
            return prev + 20;
          });
        }, 300);
        
        return;
      }

      // Fallback: redirect to external download services
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      
      if (videoId) {
        let downloadUrl = '';
        
        if (format.ext === 'mp3' || format.quality.includes('kbps')) {
          // For audio downloads, use a YouTube to MP3 converter
          downloadUrl = `https://ytmp3.cc/en13/${videoId}/`;
        } else {
          // For video downloads, use ss prefix trick
          downloadUrl = url.replace('youtube.com', 'ssyoutube.com').replace('youtu.be', 'ssyoutube.com');
        }
        
        // Open in new tab
        window.open(downloadUrl, '_blank', 'noopener,noreferrer');
        
        toast({
          title: "Redirecting to Download",
          description: "Opening download page in a new tab",
        });

        // Simulate progress
        const interval = setInterval(() => {
          setDownloadProgress(prev => {
            if (prev === null || prev >= 100) {
              clearInterval(interval);
              setTimeout(() => setDownloadProgress(null), 2000);
              return 100;
            }
            return prev + 25;
          });
        }, 400);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Download failed";
      
      toast({
        title: "Download Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      setDownloadProgress(null);
      console.error('Download error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="text-center space-y-4 flex-1">
            <h1 className="text-5xl font-bold text-foreground animate-fade-in bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Video Downloader
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in">
              Download videos from YouTube, Facebook, Vimeo, and more
            </p>
          </div>
          <ThemeToggle />
        </div>

        <Card className="glass-effect shadow-elegant hover:shadow-glow transition-all duration-500">
          <CardContent className="p-8">
            <UrlInput onSubmit={handleUrlSubmit} loading={loading} />
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive glass-effect animate-fade-in">
            <CardContent className="p-4">
              <p className="text-destructive text-center font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="glass-effect animate-fade-in">
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary shadow-glow"></div>
                <span className="text-muted-foreground animate-pulse text-lg">Fetching video information...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {videoInfo && (
          <div className="space-y-6 animate-fade-in">
            <VideoPreview videoInfo={videoInfo} onInstantDownload={handleDownload} downloadProgress={downloadProgress} />
            <DownloadOptions 
              formats={videoInfo.formats} 
              onDownload={handleDownload}
              downloadProgress={downloadProgress}
            />
          </div>
        )}

        {downloadProgress !== null && (
          <ProgressIndicator progress={downloadProgress} />
        )}
      </div>
    </div>
  );
};

export default Index;

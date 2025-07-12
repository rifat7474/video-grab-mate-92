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
      // Get actual download URL from our download service
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DOWNLOAD_VIDEO), {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ 
          url: url,
          format_id: format.format_id,
          quality: format.quality 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Download failed' }));
        throw new Error(errorData.error || 'Failed to get download URL');
      }

      const downloadData = await response.json();
      
      if (!downloadData.download_url) {
        throw new Error('No download URL received');
      }

      // Create download link with proper filename
      const link = document.createElement('a');
      link.href = downloadData.download_url;
      link.download = `${videoInfo?.title?.replace(/[^a-zA-Z0-9\s]/g, '') || 'video'}.${format.ext}`;
      link.style.display = 'none';
      
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
            <VideoPreview videoInfo={videoInfo} onInstantDownload={handleDownload} />
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

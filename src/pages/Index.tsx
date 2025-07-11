import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UrlInput } from "@/components/video-downloader/UrlInput";
import { VideoPreview } from "@/components/video-downloader/VideoPreview";
import { DownloadOptions } from "@/components/video-downloader/DownloadOptions";
import { ProgressIndicator } from "@/components/video-downloader/ProgressIndicator";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { API_CONFIG, buildApiUrl } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  uploader: string;
  formats: Array<{
    format_id: string;
    ext: string;
    quality: string;
    filesize?: number;
    url: string;
  }>;
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
      console.log(`Calling Python FastAPI backend at: ${buildApiUrl(API_CONFIG.ENDPOINTS.DOWNLOAD_VIDEO)}`);
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DOWNLOAD_VIDEO), {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ url: inputUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch video information');
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

  const handleDownload = async (format: VideoInfo['formats'][0]) => {
    setDownloadProgress(0);
    
    console.log(`Download would be initiated for format:`, format);
    
    // Create a temporary link to download the video
    try {
      const link = document.createElement('a');
      link.href = format.url;
      link.download = `${videoInfo?.title || 'video'}.${format.ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your download should begin shortly",
      });
    } catch (err) {
      toast({
        title: "Download Error",
        description: "Failed to start download",
        variant: "destructive",
      });
    }
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          return null;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-center space-y-4 flex-1">
            <h1 className="text-4xl font-bold text-foreground animate-fade-in">Video Downloader</h1>
            <p className="text-lg text-muted-foreground animate-fade-in">
              Download videos from YouTube, Facebook, Vimeo, and more
            </p>
          </div>
          <ThemeToggle />
        </div>

        <Card>
          <CardContent className="p-6">
            <UrlInput onSubmit={handleUrlSubmit} loading={loading} />
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive animate-fade-in">
            <CardContent className="p-4">
              <p className="text-destructive text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-muted-foreground animate-pulse">Fetching video information...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {videoInfo && (
          <div className="space-y-4 animate-fade-in">
            <VideoPreview videoInfo={videoInfo} />
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

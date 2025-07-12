
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, User, Download } from "lucide-react";
import { VideoInfo, VideoFormat } from "@/pages/Index";

interface VideoPreviewProps {
  videoInfo: VideoInfo;
  onInstantDownload?: (format: VideoFormat) => void;
}

export const VideoPreview = ({ videoInfo, onInstantDownload }: VideoPreviewProps) => {
  // Get the best quality video format for instant download
  const getBestFormat = (): VideoFormat | null => {
    const videoFormats = videoInfo.formats.filter(f => f.ext !== 'mp3' && f.quality.endsWith('p'));
    if (videoFormats.length === 0) return videoInfo.formats[0] || null;
    
    // Sort by quality (higher resolution first)
    videoFormats.sort((a, b) => {
      const aHeight = parseInt(a.quality.replace('p', '')) || 0;
      const bHeight = parseInt(b.quality.replace('p', '')) || 0;
      return bHeight - aHeight;
    });
    
    return videoFormats[0];
  };

  const bestFormat = getBestFormat();
  return (
    <Card className="glass-effect shadow-elegant hover:shadow-glow transition-all duration-500 hover-scale">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-80 flex-shrink-0">
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="w-full h-auto rounded-xl shadow-elegant transition-transform duration-300 hover:scale-105 border border-border/50"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/320x180?text=Video+Thumbnail";
              }}
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold text-foreground line-clamp-2 animate-fade-in">
              {videoInfo.title}
            </h2>
            
            <div className="flex flex-wrap gap-6 text-muted-foreground animate-fade-in">
              <div className="flex items-center gap-2 hover:text-primary transition-colors duration-200 cursor-pointer">
                <User className="w-5 h-5" />
                <span className="font-medium">{videoInfo.uploader}</span>
              </div>
              
              <div className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{videoInfo.duration}</span>
              </div>
            </div>
            
            <div className="pt-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground font-medium">
                  {videoInfo.formats.length} download options available
                </p>
                
                {bestFormat && onInstantDownload && (
                  <Button
                    onClick={() => onInstantDownload(bestFormat)}
                    className="gradient-primary hover-scale transition-all duration-300 shadow-elegant hover:shadow-glow font-semibold"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Instant Download ({bestFormat.quality})
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

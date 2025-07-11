
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User } from "lucide-react";
import { VideoInfo } from "@/pages/Index";

interface VideoPreviewProps {
  videoInfo: VideoInfo;
}

export const VideoPreview = ({ videoInfo }: VideoPreviewProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover-scale">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-80 flex-shrink-0">
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="w-full h-auto rounded-lg shadow-sm transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/320x180?text=Video+Thumbnail";
              }}
            />
          </div>
          
          <div className="flex-1 space-y-3">
            <h2 className="text-xl font-semibold text-foreground line-clamp-2 animate-fade-in">
              {videoInfo.title}
            </h2>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground animate-fade-in">
              <div className="flex items-center gap-1 hover:text-foreground transition-colors duration-200">
                <User className="w-4 h-4" />
                <span>{videoInfo.uploader}</span>
              </div>
              
              <div className="flex items-center gap-1 hover:text-foreground transition-colors duration-200">
                <Clock className="w-4 h-4" />
                <span>{videoInfo.duration}</span>
              </div>
            </div>
            
            <div className="pt-2 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                {videoInfo.formats.length} download options available
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

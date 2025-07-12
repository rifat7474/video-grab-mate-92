
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileVideo, Music } from "lucide-react";
import { VideoInfo, VideoFormat } from "@/pages/Index";

interface DownloadOptionsProps {
  formats: VideoFormat[];
  onDownload: (format: VideoFormat) => void;
  downloadProgress: number | null;
}

export const DownloadOptions = ({ formats, onDownload, downloadProgress }: DownloadOptionsProps) => {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFormatIcon = (ext: string) => {
    return ext === 'mp3' ? <Music className="w-4 h-4" /> : <FileVideo className="w-4 h-4" />;
  };

  const videoFormats = formats.filter(f => f.ext !== 'mp3');
  const audioFormats = formats.filter(f => f.ext === 'mp3');

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
      {videoFormats.length > 0 && (
        <Card className="glass-effect shadow-elegant hover:shadow-glow transition-all duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <FileVideo className="w-6 h-6 text-primary" />
              Video Formats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {videoFormats.map((format, index) => (
              <div 
                key={format.format_id} 
                className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:bg-muted/30 transition-all duration-300 hover-scale group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    {getFormatIcon(format.ext)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{format.quality}</div>
                    <div className="text-sm text-muted-foreground">
                      {format.ext.toUpperCase()} • {formatFileSize(format.filesize)}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => onDownload(format)}
                  disabled={downloadProgress !== null}
                  className="gradient-primary hover-scale transition-all duration-300 shadow-elegant hover:shadow-glow font-medium"
                >
                  <Download className={`w-4 h-4 mr-2 ${downloadProgress !== null ? 'animate-bounce' : ''}`} />
                  Download
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {audioFormats.length > 0 && (
        <Card className="glass-effect shadow-elegant hover:shadow-glow transition-all duration-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Music className="w-6 h-6 text-primary" />
              Audio Formats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {audioFormats.map((format, index) => (
              <div 
                key={format.format_id} 
                className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:bg-muted/30 transition-all duration-300 hover-scale group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    {getFormatIcon(format.ext)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{format.quality}</div>
                    <div className="text-sm text-muted-foreground">
                      {format.ext.toUpperCase()} • {formatFileSize(format.filesize)}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => onDownload(format)}
                  disabled={downloadProgress !== null}
                  className="gradient-primary hover-scale transition-all duration-300 shadow-elegant hover:shadow-glow font-medium"
                >
                  <Download className={`w-4 h-4 mr-2 ${downloadProgress !== null ? 'animate-bounce' : ''}`} />
                  Download
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

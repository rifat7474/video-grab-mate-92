import { Button } from "@/components/ui/button";
import { Download, Zap } from "lucide-react";
import { VideoFormat } from "@/pages/Index";

interface InstantDownloadProps {
  formats: VideoFormat[];
  onDownload: (format: VideoFormat) => void;
  disabled?: boolean;
}

export const InstantDownload = ({ formats, onDownload, disabled }: InstantDownloadProps) => {
  const getBestFormat = (): VideoFormat | null => {
    // First, try to get the best video format
    const videoFormats = formats.filter(f => f.ext !== 'mp3' && f.quality.endsWith('p'));
    
    if (videoFormats.length > 0) {
      // Sort by quality (higher resolution first)
      videoFormats.sort((a, b) => {
        const aHeight = parseInt(a.quality.replace('p', '')) || 0;
        const bHeight = parseInt(b.quality.replace('p', '')) || 0;
        return bHeight - aHeight;
      });
      return videoFormats[0];
    }
    
    // Fallback to any available format
    return formats[0] || null;
  };

  const bestFormat = getBestFormat();

  if (!bestFormat) {
    return null;
  }

  const handleInstantDownload = () => {
    onDownload(bestFormat);
  };

  return (
    <Button
      onClick={handleInstantDownload}
      disabled={disabled}
      size="lg"
      className="gradient-primary hover-scale transition-all duration-300 shadow-elegant hover:shadow-glow font-semibold text-lg px-8"
    >
      <Zap className="w-5 h-5 mr-2" />
      <Download className="w-5 h-5 mr-2" />
      Instant Download ({bestFormat.quality})
    </Button>
  );
};
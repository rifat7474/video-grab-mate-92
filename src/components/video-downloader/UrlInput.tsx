import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export const UrlInput = ({ onSubmit, loading }: UrlInputProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="url"
          placeholder="Paste video URL here (YouTube, Facebook, Vimeo, etc.)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 glass-effect transition-all duration-300 focus:scale-[1.02] hover:shadow-elegant focus:shadow-glow border-border/50"
          disabled={loading}
        />
        <Button 
          type="submit" 
          disabled={!url.trim() || !isValidUrl(url) || loading}
          className="sm:w-auto w-full gradient-primary hover-scale transition-all duration-300 shadow-elegant hover:shadow-glow font-semibold"
        >
          <Download className={`w-5 h-5 mr-2 ${loading ? 'animate-bounce' : ''}`} />
          {loading ? "Processing..." : "Fetch Video"}
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground animate-fade-in">
        <p>Supported platforms: YouTube, Facebook, Vimeo, TikTok, Instagram, Twitter, and many more</p>
      </div>
    </form>
  );
};

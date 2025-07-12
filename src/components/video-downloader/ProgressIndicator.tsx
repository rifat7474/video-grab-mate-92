
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

interface ProgressIndicatorProps {
  progress: number;
}

export const ProgressIndicator = ({ progress }: ProgressIndicatorProps) => {
  const isComplete = progress >= 100;

  return (
    <Card className="glass-effect shadow-elegant animate-fade-in">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-foreground">
              {isComplete ? "Download Complete!" : "Downloading..."}
            </span>
            <span className="text-lg font-bold text-primary animate-pulse">
              {Math.round(progress)}%
            </span>
          </div>
          
          <Progress value={progress} className="w-full transition-all duration-300 h-3" />
          
          {isComplete && (
            <div className="flex items-center gap-3 text-primary animate-fade-in font-medium">
              <CheckCircle className="w-5 h-5 animate-scale-in" />
              <span>Your download is ready!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

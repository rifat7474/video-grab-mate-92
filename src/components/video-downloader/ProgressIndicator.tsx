
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

interface ProgressIndicatorProps {
  progress: number;
}

export const ProgressIndicator = ({ progress }: ProgressIndicatorProps) => {
  const isComplete = progress >= 100;

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {isComplete ? "Download Complete!" : "Downloading..."}
            </span>
            <span className="text-sm text-muted-foreground animate-pulse">
              {Math.round(progress)}%
            </span>
          </div>
          
          <Progress value={progress} className="w-full transition-all duration-300" />
          
          {isComplete && (
            <div className="flex items-center gap-2 text-green-600 animate-fade-in">
              <CheckCircle className="w-4 h-4 animate-scale-in" />
              <span className="text-sm">Your download is ready!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

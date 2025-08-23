import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="mb-8">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
            <AlertTriangle className="text-red-600" size={16} />
          </div>
          <div className="flex-1">
            <h3 className="text-red-800 font-medium mb-2">Search Error</h3>
            <p className="text-red-700 text-sm mb-3">{message}</p>
            <Button 
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              data-testid="button-retry-search"
            >
              <RotateCcw className="mr-2" size={16} />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

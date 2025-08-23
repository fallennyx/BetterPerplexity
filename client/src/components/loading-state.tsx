import { Search, CheckCircle, BarChart3 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
            <Search className="text-white" size={12} />
          </div>
          <span className="text-slate-800 font-medium">Searching the web...</span>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Running parallel searches (General + News)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <span>Analyzing sources and generating AI answer</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <span>Ranking and deduplicating results</span>
          </div>
        </div>
      </div>
    </div>
  );
}

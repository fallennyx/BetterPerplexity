import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { List, Calendar, ExternalLink, Eye, Star } from "lucide-react";
import type { SearchResult } from "@shared/schema";

interface SearchResultsProps {
  results: SearchResult[];
  totalCount: number;
}

export function SearchResults({ results, totalCount }: SearchResultsProps) {
  const [sortBy, setSortBy] = useState<"relevance" | "date">("relevance");
  const [displayedCount, setDisplayedCount] = useState(Math.min(8, results.length));

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const getSourceColor = (source?: string) => {
    switch (source) {
      case "news":
        return "bg-green-100 text-green-700";
      case "general":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-purple-100 text-purple-700";
    }
  };

  const sortedResults = [...results].slice(0, displayedCount);

  const loadMore = () => {
    setDisplayedCount(Math.min(displayedCount + 8, results.length));
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-800 flex items-center">
          <List className="mr-3 text-slate-500" size={20} />
          All Sources
          <Badge variant="secondary" className="ml-3">
            {totalCount} results
          </Badge>
        </h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant={sortBy === "relevance" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("relevance")}
            className="text-sm"
            data-testid="button-sort-relevance"
          >
            Relevance
          </Button>
          <Button 
            variant={sortBy === "date" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("date")}
            className="text-sm"
            data-testid="button-sort-date"
          >
            <Calendar className="mr-1" size={14} />
            Date
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedResults.map((result, index) => (
          <div 
            key={result.url} 
            className="source-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            data-testid={`card-search-result-${index}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3 flex-1">
                {result.favicon && (
                  <img 
                    src={result.favicon} 
                    alt="Source favicon" 
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold text-lg leading-tight group-hover:underline transition-colors line-clamp-2"
                    data-testid={`link-result-${index}`}
                  >
                    {result.title}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">{getHostname(result.url)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Badge className={getSourceColor(result.source)}>
                  {result.source?.charAt(0).toUpperCase() + (result.source?.slice(1) || "")}
                </Badge>
                {result.score && (
                  <div className="text-sm text-gray-500 flex items-center">
                    <Star className="text-yellow-400 mr-1" size={14} />
                    <span className="font-medium">{result.score.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {result.content && (
              <p className="text-gray-700 leading-relaxed mb-4">
                {result.content.length > 300 
                  ? `${result.content.slice(0, 300)}...` 
                  : result.content
                }
              </p>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {result.publishedDate && (
                  <span className="flex items-center">
                    <Calendar className="mr-1" size={12} />
                    {result.publishedDate}
                  </span>
                )}
                <span className="flex items-center">
                  <Eye className="mr-1" size={12} />
                  Quick read
                </span>
              </div>
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center transition-colors"
                data-testid={`link-read-full-${index}`}
              >
                Read full article
                <ExternalLink className="ml-1" size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      {displayedCount < results.length && (
        <div className="mt-8 text-center">
          <Button 
            variant="outline"
            onClick={loadMore}
            className="px-6 py-3"
            data-testid="button-load-more"
          >
            Load More Results ({results.length - displayedCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}

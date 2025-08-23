import { forwardRef } from "react";
import { Brain, CheckCircle, ExternalLink } from "lucide-react";
import type { SearchResult } from "@shared/schema";

interface AIAnswerProps {
  answer: string;
  topSources: SearchResult[];
  query: string;
}

export const AIAnswer = forwardRef<HTMLDivElement, AIAnswerProps>(
  ({ answer, topSources, query }, ref) => {
    const getHostname = (url: string) => {
      try {
        return new URL(url).hostname;
      } catch {
        return url;
      }
    };

    return (
      <div className="mb-8" id="research-card-export" ref={ref}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="text-white" size={16} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">AI Answer</h2>
                <p className="text-sm text-slate-600">Generated from multiple sources</p>
              </div>
              <div className="ml-auto flex items-center space-x-2">
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                  <CheckCircle className="mr-1 inline" size={12} />
                  Verified
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose prose-slate max-w-none">
              <div className="text-slate-800 leading-relaxed whitespace-pre-line">
                {answer}
              </div>
            </div>
            
            {/* Top Sources Preview */}
            {topSources.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center">
                  <ExternalLink className="mr-2 text-blue-500" size={16} />
                  Top Sources
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topSources.map((source, index) => (
                    <a 
                      key={source.url} 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
                      data-testid={`link-top-source-${index}`}
                    >
                      <div className="flex items-start space-x-3">
                        {source.favicon && (
                          <img 
                            src={source.favicon} 
                            alt="Source favicon" 
                            className="w-4 h-4 mt-0.5 flex-shrink-0" 
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {source.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{getHostname(source.url)}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

AIAnswer.displayName = "AIAnswer";

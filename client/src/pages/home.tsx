import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchInterface } from "@/components/search-interface";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { AIAnswer } from "@/components/ai-answer";
import { ExportActions } from "@/components/export-actions";
import { SearchResults } from "@/components/search-results";
import { Search, Zap, Globe } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);

  const {
    data: searchResults,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["/api/search", searchQuery],
    enabled: shouldSearch && searchQuery.trim().length > 0,
    retry: false,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShouldSearch(true);
    refetch();
  };

  const handleRetry = () => {
    if (searchQuery.trim()) {
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Search className="text-white" size={16} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Betterperplexity</h1>
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                Beta
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span className="flex items-center">
                <Zap className="text-yellow-500 mr-1" size={14} />
                AI-Powered
              </span>
              <span className="flex items-center">
                <Globe className="text-blue-500 mr-1" size={14} />
                Real-time Search
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <SearchInterface onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && <LoadingState />}
        
        {error && (
          <ErrorState 
            message={error instanceof Error ? error.message : "Search failed"} 
            onRetry={handleRetry} 
          />
        )}

        {searchResults && !isLoading && (
          <>
            <AIAnswer 
              answer={searchResults.answer} 
              topSources={searchResults.results.slice(0, 3)}
              query={searchResults.query}
            />
            
            <ExportActions 
              searchResults={searchResults}
            />
            
            <SearchResults 
              results={searchResults.results}
              totalCount={searchResults.results.length}
            />

            {/* Footer Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-database text-gray-400"></i>
                    <span className="text-sm text-gray-600">Powered by Tavily API</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-clock text-gray-400"></i>
                    <span className="text-sm text-gray-600">Real-time results</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {searchResults.results.length} sources • 2 parallel searches
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

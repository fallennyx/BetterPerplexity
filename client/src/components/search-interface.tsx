import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send } from "lucide-react";

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const EXAMPLE_QUERIES = [
  "Recent AI breakthroughs",
  "Climate change solutions", 
  "Tech industry news"
];

export function SearchInterface({ onSearch, isLoading }: SearchInterfaceProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
    onSearch(exampleQuery);
  };

  return (
    <div className="mb-8">
      <div className="search-container bg-white rounded-xl shadow-sm border border-gray-200 p-1 transition-all duration-200 focus-within:transform focus-within:-translate-y-1 focus-within:shadow-xl">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <div className="flex-1 flex items-center space-x-3 px-4 py-3">
            <Search className="text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Ask anything... (e.g., 'Latest developments in AI research' or 'Climate change impact 2024')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-base bg-transparent border-none outline-none shadow-none focus-visible:ring-0"
              data-testid="input-search-query"
              disabled={isLoading}
            />
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span className="hidden sm:block">Press Enter or</span>
              <kbd className="hidden sm:block px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
                ⏎
              </kbd>
            </div>
          </div>
          <Button 
            type="submit"
            disabled={!query.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 px-6 py-3 rounded-lg"
            data-testid="button-search"
          >
            <Send size={16} className="mr-2" />
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>
      </div>
      
      {/* Quick Examples */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 mr-2">Try:</span>
        {EXAMPLE_QUERIES.map((example) => (
          <Button
            key={example}
            variant="ghost"
            size="sm"
            onClick={() => handleExampleClick(example)}
            className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
            data-testid={`button-example-${example.toLowerCase().replace(/\s+/g, '-')}`}
            disabled={isLoading}
          >
            {example}
          </Button>
        ))}
      </div>
    </div>
  );
}

import { apiRequest } from "./queryClient";
import type { SearchRequest, SearchResponse, ExtractRequest, ExtractResponse } from "@shared/schema";

export async function searchTavily(query: string): Promise<SearchResponse> {
  const response = await apiRequest("POST", "/api/search", { query });
  return response.json();
}

export async function extractContent(urls: string[]): Promise<ExtractResponse> {
  const response = await apiRequest("POST", "/api/extract", { urls });
  return response.json();
}

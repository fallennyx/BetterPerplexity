import { z } from "zod";

export const searchRequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
});

export const searchResultSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  content: z.string().optional(),
  score: z.number().optional(),
  favicon: z.string().optional(),
  source: z.string().optional(),
  publishedDate: z.string().optional(),
});

export const searchResponseSchema = z.object({
  query: z.string(),
  answer: z.string(),
  results: z.array(searchResultSchema),
  timestamp: z.string().optional(),
});

export const extractRequestSchema = z.object({
  urls: z.array(z.string().url()),
});

export const extractResultSchema = z.object({
  url: z.string().url(),
  raw_content: z.string().optional(),
  title: z.string().optional(),
});

export const extractResponseSchema = z.object({
  results: z.array(extractResultSchema),
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;
export type ExtractRequest = z.infer<typeof extractRequestSchema>;
export type ExtractResult = z.infer<typeof extractResultSchema>;
export type ExtractResponse = z.infer<typeof extractResponseSchema>;

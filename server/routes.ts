import type { Express } from "express";
import { createServer, type Server } from "http";
import { searchRequestSchema, extractRequestSchema } from "@shared/schema";

const TAVILY_API_BASE = "https://api.tavily.com";

function getTavilyHeaders() {
  const apiKey = process.env.TAVILY_API_KEY || process.env.VITE_TAVILY_API_KEY || "default_key";
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };
}

async function tavilyRequest(path: string, body: any) {
  try {
    const response = await fetch(`${TAVILY_API_BASE}${path}`, {
      method: "POST",
      headers: getTavilyHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      return { error: `Tavily API error: ${response.status} ${response.statusText}` };
    }

    return await response.json();
  } catch (error) {
    return { error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Search endpoint - parallel Tavily searches
  app.post("/api/search", async (req, res) => {
    try {
      const { query } = searchRequestSchema.parse(req.body);

      // Parallel searches: general/basic + news/advanced
      const [generalResult, newsResult] = await Promise.all([
        tavilyRequest("/search", {
          query,
          topic: "general",
          search_depth: "basic",
          include_answer: true,
          max_results: 8
        }),
        tavilyRequest("/search", {
          query,
          topic: "news", 
          search_depth: "advanced",
          include_answer: true,
          max_results: 8
        })
      ]);

      if (generalResult.error && newsResult.error) {
        return res.status(500).json({ error: "Both search requests failed" });
      }

      // Merge and dedupe results by normalized URL
      const urlMap = new Map();
      const results = [];

      [generalResult, newsResult].forEach((result, index) => {
        if (result.error) return;
        
        const sourceType = index === 0 ? "general" : "news";
        result.results?.forEach((item: any) => {
          try {
            const url = new URL(item.url);
            const normalizedUrl = url.origin + url.pathname;
            
            if (!urlMap.has(normalizedUrl) || (item.score ?? 0) > (urlMap.get(normalizedUrl).score ?? 0)) {
              urlMap.set(normalizedUrl, {
                ...item,
                source: sourceType,
                publishedDate: item.published_date || "Unknown"
              });
            }
          } catch (error) {
            // Skip invalid URLs
          }
        });
      });

      // Convert map to array and sort by score
      const mergedResults = Array.from(urlMap.values())
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

      const answer = generalResult.answer || newsResult.answer || "No answer available";

      res.json({
        query,
        answer,
        results: mergedResults,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request format" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Extract endpoint for getting full content
  app.post("/api/extract", async (req, res) => {
    try {
      const { urls } = extractRequestSchema.parse(req.body);

      const result = await tavilyRequest("/extract", {
        urls,
        extract_depth: "basic"
      });

      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      res.json(result);

    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request format" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

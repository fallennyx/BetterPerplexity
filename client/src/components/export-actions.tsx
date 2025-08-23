import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Download, Image, Archive, Info } from "lucide-react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import * as htmlToImage from "html-to-image";
import DOMPurify from "dompurify";
import type { SearchResponse } from "@shared/schema";
import { extractContent } from "@/lib/tavily";

interface ExportActionsProps {
  searchResults: SearchResponse;
}

export function ExportActions({ searchResults }: ExportActionsProps) {
  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const exportPNG = async () => {
    try {
      const element = document.getElementById("research-card-export");
      if (!element) {
        throw new Error("Research card element not found");
      }
      
      const dataUrl = await htmlToImage.toPng(element, { 
        cacheBust: true,
        backgroundColor: "#ffffff"
      });
      const blob = await (await fetch(dataUrl)).blob();
      saveAs(blob, `research-card-${Date.now()}.png`);
    } catch (error) {
      console.error("Failed to export PNG:", error);
      alert("Failed to export research card. Please try again.");
    }
  };

  const exportZIP = async () => {
    try {
      const zip = new JSZip();
      
      // Add search results JSON
      zip.file("results.json", JSON.stringify({
        query: searchResults.query,
        timestamp: new Date().toISOString(),
        answer: searchResults.answer,
        results: searchResults.results
      }, null, 2));

      // Get extracts for top 6 results to stay within API limits
      const topUrls = searchResults.results.slice(0, 6).map(r => r.url);
      
      if (topUrls.length > 0) {
        try {
          const extracts = await extractContent(topUrls);
          
          // Add extracted content
          extracts.results?.forEach((item, index) => {
            const cleanContent = DOMPurify.sanitize(item.raw_content || "", { ALLOWED_TAGS: [] });
            if (cleanContent.trim()) {
              zip.file(`extracts/${index + 1}-${getHostname(item.url)}.txt`, cleanContent);
            }
          });
        } catch (extractError) {
          console.warn("Failed to extract content:", extractError);
          // Continue without extracts
        }
      }

      // Add research card PNG
      try {
        const element = document.getElementById("research-card-export");
        if (element) {
          const dataUrl = await htmlToImage.toPng(element, { 
            cacheBust: true,
            backgroundColor: "#ffffff"
          });
          const pngBlob = await (await fetch(dataUrl)).blob();
          zip.file("research-card.png", pngBlob);
        }
      } catch (pngError) {
        console.warn("Failed to include research card in ZIP:", pngError);
        // Continue without PNG
      }

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `research-bundle-${Date.now()}.zip`);
    } catch (error) {
      console.error("Failed to export ZIP:", error);
      alert("Failed to export research bundle. Please try again.");
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <Download className="mr-3 text-blue-500" size={20} />
              Export Research
            </h3>
            <p className="text-sm text-gray-600 mt-1">Save your research for offline access and sharing</p>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="mr-1" size={14} />
            Generated now
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            className="export-card bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-xl" 
            onClick={exportPNG}
            data-testid="card-export-png"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image className="text-white" size={20} />
              </div>
              <span className="bg-blue-200 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">PNG</span>
            </div>
            <h4 className="text-slate-800 font-semibold mb-2 group-hover:text-blue-700 transition-colors">Research Card</h4>
            <p className="text-sm text-gray-600 mb-4">Beautiful visual summary with AI answer and top sources</p>
            <div className="flex items-center text-sm text-blue-600 font-medium">
              <span>Export as Image</span>
              <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>
          
          <div 
            className="export-card bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-xl" 
            onClick={exportZIP}
            data-testid="card-export-zip"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Archive className="text-white" size={20} />
              </div>
              <span className="bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded-full">ZIP</span>
            </div>
            <h4 className="text-slate-800 font-semibold mb-2 group-hover:text-green-700 transition-colors">Research Bundle</h4>
            <p className="text-sm text-gray-600 mb-4">Complete package with extracted content and metadata</p>
            <div className="flex items-center text-sm text-green-600 font-medium">
              <span>Export as Archive</span>
              <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="text-gray-400 mt-0.5" size={16} />
            <div className="text-sm text-gray-600">
              <p className="mb-1"><strong>Research Card:</strong> Perfect for presentations and quick sharing</p>
              <p><strong>Research Bundle:</strong> Includes full text extracts, metadata, and research card</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

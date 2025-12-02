import React, { useState, useCallback } from 'react';
import { generateImageWithGemini } from '../services/geminiService';
import { Download, Loader2, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null); // Clear previous image while loading

    try {
      const imageUrl = await generateImageWithGemini(prompt);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `prisma-ai-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row h-full">
      {/* Input Section */}
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Create with Words</h2>
          <p className="text-slate-400">Describe your imagination and let Gemini bring it to visual reality.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-800/40 p-1">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cyberpunk street market at night, neon lights reflecting on rain-slicked pavement, highly detailed, 8k..."
            className="h-40 w-full resize-none rounded-xl bg-slate-900/50 p-4 text-slate-100 placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/50 border border-transparent focus:border-indigo-500/30 transition-all"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Magic...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Image
              </>
            )}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        </div>
        
        {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{error}</p>
            </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="flex-1">
        <div className="relative flex aspect-square w-full items-center justify-center rounded-2xl border border-white/10 bg-slate-900/50 shadow-2xl backdrop-blur-sm overflow-hidden group">
          
          {generatedImage ? (
            <>
              <img
                src={generatedImage}
                alt="Generated AI"
                className="h-full w-full object-contain transition-transform duration-700 hover:scale-105"
              />
              {/* Overlay controls */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-end gap-3">
                 <button
                    onClick={handleDownload}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
                    title="Download Image"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/80 hover:bg-indigo-500 text-white backdrop-blur-md transition-colors"
                    title="Regenerate"
                  >
                     <RefreshCw className="h-5 w-5" />
                  </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-slate-500">
              {isLoading ? (
                 <div className="relative">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/20 blur-xl"></div>
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-500 relative z-10" />
                 </div>
              ) : (
                <>
                  <div className="rounded-full bg-slate-800 p-6">
                    <Sparkles className="h-12 w-12 text-slate-600" />
                  </div>
                  <p className="text-lg font-medium">Your creation appears here</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
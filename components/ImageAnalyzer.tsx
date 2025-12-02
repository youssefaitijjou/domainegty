import React, { useState, useRef, useCallback } from 'react';
import { analyzeImageWithGemini } from '../services/geminiService';
import { Upload, X, Search, Loader2, FileImage, ClipboardCopy, CheckCircle2 } from 'lucide-react';

export const ImageAnalyzer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setResult(null);
      } else {
        alert("Please upload a valid image file.");
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setResult(null);
  };

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        const analysisText = await analyzeImageWithGemini(base64String, selectedFile.type, prompt);
        setResult(analysisText);
      } catch (error) {
        setResult("Failed to analyze image. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(selectedFile);
  }, [selectedFile, prompt]);

  const copyToClipboard = () => {
      if (result) {
          navigator.clipboard.writeText(result);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
      }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 h-full">
      {/* Left Column: Upload & Prompt */}
      <div className="space-y-6">
        <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Visual Analysis</h2>
            <p className="text-slate-400">Upload an image and ask Gemini to uncover its details, style, or context.</p>
        </div>

        {/* Upload Area */}
        <div 
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            className={`relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 group ${
              selectedFile 
                ? 'border-teal-500/30 bg-slate-900/50' 
                : 'border-slate-700 bg-slate-800/20 hover:border-teal-500/50 hover:bg-slate-800/40'
            }`}
        >
          {previewUrl ? (
            <div className="relative h-full w-full p-2">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="h-full w-full rounded-xl object-contain max-h-[400px]" 
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute right-4 top-4 rounded-full bg-slate-900/80 p-2 text-slate-400 hover:text-white hover:bg-red-500/80 transition-colors backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center p-8">
              <div className="rounded-full bg-slate-800 p-4 group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-8 w-8 text-teal-500" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-200">Drop an image here</p>
                <p className="text-sm text-slate-500">or click to browse files</p>
              </div>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Prompt Input */}
        <div className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask something about the image (optional)..."
                    className="w-full rounded-xl bg-slate-800/50 border border-white/10 py-3 pl-4 pr-12 text-white placeholder-slate-500 outline-none focus:border-teal-500/50 focus:bg-slate-800 transition-all"
                />
            </div>
            
            <button
                onClick={handleAnalyze}
                disabled={!selectedFile || isLoading}
                className="w-full rounded-xl bg-teal-600 py-3.5 font-semibold text-white shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-500 hover:shadow-teal-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Search className="h-5 w-5" />
                )}
                {isLoading ? 'Analyzing...' : 'Analyze Image'}
            </button>
        </div>
      </div>

      {/* Right Column: Result */}
      <div className="relative flex flex-col rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm h-full min-h-[400px]">
        <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <FileImage className="h-5 w-5 text-teal-400" />
                Analysis Result
            </h3>
            {result && (
                <button 
                    onClick={copyToClipboard}
                    className="p-2 text-slate-400 hover:text-teal-400 transition-colors"
                    title="Copy text"
                >
                    {isCopied ? <CheckCircle2 className="h-5 w-5 text-teal-500" /> : <ClipboardCopy className="h-5 w-5" />}
                </button>
            )}
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar rounded-xl bg-slate-950/30 p-4 shadow-inner">
            {result ? (
                <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {result}
                </div>
            ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-600">
                    <div className="h-16 w-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                         <Search className="h-6 w-6" />
                    </div>
                    <p>Analysis results will appear here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
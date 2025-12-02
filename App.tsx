import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-50 selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-teal-600/20 blur-[128px]" />
      </div>

      <Header currentMode={mode} onModeChange={setMode} />

      <main className="relative z-10 flex-1 container mx-auto px-4 py-8 lg:py-12">
        <div className="mx-auto max-w-7xl h-full">
            {mode === AppMode.GENERATE ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <ImageGenerator />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ImageAnalyzer />
              </div>
            )}
        </div>
      </main>

       <footer className="relative z-10 border-t border-white/5 bg-slate-900/50 py-6 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            Powered by Gemini 2.5 Flash & Flash Image • Prisma AI Studio
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
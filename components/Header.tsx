import React from 'react';
import { AppMode } from '../types';
import { Zap, Image as ImageIcon, Aperture } from 'lucide-react';

interface HeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/30">
            <Aperture className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Prisma<span className="text-indigo-400">AI</span>
          </span>
        </div>

        <nav className="flex items-center gap-1 rounded-full bg-slate-800/50 p-1 border border-white/5">
          <button
            onClick={() => onModeChange(AppMode.GENERATE)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              currentMode === AppMode.GENERATE
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="h-4 w-4" />
            Generate
          </button>
          <button
            onClick={() => onModeChange(AppMode.ANALYZE)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              currentMode === AppMode.ANALYZE
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Analyze
          </button>
        </nav>
      </div>
    </header>
  );
};
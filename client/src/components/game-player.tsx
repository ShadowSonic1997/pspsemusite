import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface GamePlayerProps {
  gameUrl: string;
}

declare global {
  interface Window {
    EJS_player: string;
    EJS_core: string;
    EJS_pathtodata: string;
    EJS_gameUrl: string;
    EJS_threads: boolean;
    EJS_emulator: any;
  }
}

export function GamePlayer({ gameUrl }: GamePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!gameUrl || scriptLoadedRef.current) return;

    // Set configuration
    window.EJS_player = '#game';
    window.EJS_core = 'psp';
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
    window.EJS_gameUrl = gameUrl;
    window.EJS_threads = true; // Critical for PSP

    // Create script
    const script = document.createElement('script');
    script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
    script.async = true;

    // Append script
    if (containerRef.current) {
      containerRef.current.appendChild(script);
      scriptLoadedRef.current = true;
    }

    // Cleanup not fully possible with this library as it modifies global scope heavily,
    // but we can try to clean up the container content if needed.
    return () => {
      // Intentionally left mostly empty to prevent breaking the emulator on quick remounts
    };
  }, [gameUrl]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-primary/20 border border-primary/20">
      <div ref={containerRef} className="w-full h-full flex items-center justify-center">
        <div id="game" className="w-full h-full"></div>
      </div>
      
      {/* Fallback/Loading state before emulator takes over */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
        <div className="text-primary flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-display tracking-widest text-sm">INITIALIZING CORE SYSTEM...</p>
        </div>
      </div>
    </div>
  );
}

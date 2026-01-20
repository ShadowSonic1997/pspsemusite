import { useState, useEffect, useRef } from "react";
import { Terminal, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  type: "log" | "warn" | "error";
  message: string;
  timestamp: string;
}

export function DebugConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const addLog = (type: LogEntry["type"], ...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev.slice(-100), {
        type,
        message,
        timestamp: new Date().toLocaleTimeString()
      }]);
    };

    console.log = (...args) => {
      addLog("log", ...args);
      originalLog.apply(console, args);
    };
    console.warn = (...args) => {
      addLog("warn", ...args);
      originalWarn.apply(console, args);
    };
    console.error = (...args) => {
      addLog("error", ...args);
      originalError.apply(console, args);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-black/80 border border-primary/50 text-primary font-mono text-xs gap-2 h-8"
        variant="outline"
      >
        <Terminal className="w-4 h-4" />
        DEBUG CONSOLE ({logs.length})
        <ChevronUp className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-primary/50 flex flex-col h-64 font-mono">
      <div className="flex items-center justify-between p-2 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2 text-primary text-sm font-bold tracking-wider">
          <Terminal className="w-4 h-4" />
          SYSTEM CONSOLE
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLogs([])}
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="h-7 w-7 text-muted-foreground hover:text-primary"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2 text-xs leading-relaxed">
              <span className="text-muted-foreground shrink-0">[{log.timestamp}]</span>
              <span className={
                log.type === 'error' ? 'text-destructive' : 
                log.type === 'warn' ? 'text-yellow-500' : 'text-primary'
              }>
                {log.message}
              </span>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
    </div>
  );
}

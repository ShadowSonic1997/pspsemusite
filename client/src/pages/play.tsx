import { useRoute } from "wouter";
import { useGame } from "@/hooks/use-games";
import { NavBar } from "@/components/nav-bar";
import { GamePlayer } from "@/components/game-player";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Play() {
  const [, params] = useRoute("/play/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: game, isLoading } = useGame(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-primary/60 font-display tracking-widest animate-pulse">LOADING ROM DATA...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-4xl font-display text-white mb-4">GAME NOT FOUND</h1>
        <Link href="/">
          <Button variant="outline">Back to Library</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO LIBRARY
            </Button>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col"
        >
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
              {game.title}
            </h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="uppercase tracking-wider">Platform: {game.platform}</span>
              {game.description && <span>• {game.description}</span>}
            </div>
          </div>

          <div className="flex-1 min-h-[500px] rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <GamePlayer gameUrl={game.url} />
          </div>

          <div className="mt-8 p-6 rounded-xl bg-card/50 border border-white/5 backdrop-blur-sm">
            <h3 className="font-display text-primary mb-4 text-lg">CONTROLS</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>D-Pad</span>
                <span className="text-white">Arrow Keys</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Circle</span>
                <span className="text-white">X</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Cross</span>
                <span className="text-white">Z</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Square</span>
                <span className="text-white">A</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Triangle</span>
                <span className="text-white">S</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>L Trigger</span>
                <span className="text-white">Q</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>R Trigger</span>
                <span className="text-white">W</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Start</span>
                <span className="text-white">Enter</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

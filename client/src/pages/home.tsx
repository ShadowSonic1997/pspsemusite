import { useGames, useDeleteGame } from "@/hooks/use-games";
import { Link } from "wouter";
import { NavBar } from "@/components/nav-bar";
import { AddGameModal } from "@/components/add-game-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Trash2, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: games, isLoading, error } = useGames();
  const deleteMutation = useDeleteGame();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-primary/60 font-display tracking-widest animate-pulse">LOADING LIBRARY...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
        <div className="text-destructive text-6xl mb-4 font-display">ERROR</div>
        <p className="text-muted-foreground max-w-md">{error.message}</p>
        <Button 
          className="mt-8" 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this game?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <NavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 tracking-tight">
              YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">LIBRARY</span>
            </h1>
            <p className="text-muted-foreground font-body text-lg max-w-2xl">
              Select a game to launch the emulator. Supports .iso, .cso, and .zip formats.
            </p>
          </div>
          <AddGameModal />
        </div>

        {/* Empty State */}
        {games?.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5"
          >
            <div className="bg-primary/10 p-6 rounded-full mb-6">
              <Gamepad2 className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">NO GAMES FOUND</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Your library is currently empty. Add your first ROM to get started.
            </p>
            <AddGameModal />
          </motion.div>
        )}

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games?.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/play/${game.id}`}>
                <Card className="group relative overflow-hidden bg-card border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] h-full cursor-pointer">
                  
                  {/* Card Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10" />
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                      onClick={(e) => handleDelete(e, game.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Thumbnail Placeholder Pattern */}
                  <div className="aspect-[16/9] w-full bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gamepad2 className="w-16 h-16 text-white/5 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>

                  <CardContent className="relative z-20 p-5">
                    <h3 className="text-xl font-bold font-display text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 uppercase">
                        PSP
                      </span>
                      <span className="text-xs text-muted-foreground uppercase">
                        {new Date(game.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {game.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
                        {game.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide mt-auto group-hover:translate-x-1 transition-transform">
                      PLAY NOW <Play className="w-3 h-3 fill-current" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

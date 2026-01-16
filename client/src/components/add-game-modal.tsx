import { useState } from "react";
import { useCreateGame } from "@/hooks/use-games";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Gamepad } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { api } from "@shared/routes";

export function AddGameModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
  });
  const { mutate, isPending } = useCreateGame();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate locally just for feedback, though api hook does it too
      api.games.create.input.parse(formData);
      
      mutate(formData, {
        onSuccess: () => {
          setOpen(false);
          setFormData({ title: "", url: "", description: "" });
          toast({
            title: "Game Added",
            description: "Your game has been added to the library.",
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        }
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: err.errors[0].message,
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95">
          <Plus className="w-5 h-5 mr-2" />
          ADD GAME
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-white/10 text-card-foreground sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display tracking-wider text-primary flex items-center gap-2">
            <Gamepad className="w-6 h-6" />
            ADD NEW ROM
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-muted-foreground uppercase text-xs tracking-wider">Game Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. God of War: Chains of Olympus"
              className="bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url" className="text-muted-foreground uppercase text-xs tracking-wider">ROM URL (.iso, .cso, .zip)</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com/roms/game.iso"
              className="bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 font-mono text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-muted-foreground uppercase text-xs tracking-wider">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter game description..."
              className="bg-background/50 border-white/10 focus:border-primary/50 focus:ring-primary/20 min-h-[100px]"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all font-bold tracking-wide"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ADDING...
                </>
              ) : (
                "ADD TO LIBRARY"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

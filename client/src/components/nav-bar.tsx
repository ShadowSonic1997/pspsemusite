import { Link, useLocation } from "wouter";
import { Gamepad2, Home, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavBar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Library" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <Gamepad2 className="w-8 h-8 text-primary relative z-10" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 font-display">
              PSP<span className="text-primary">.EMU</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 cursor-pointer",
                    isActive 
                      ? "bg-white/5 text-primary shadow-[0_0_15px_rgba(6,182,212,0.15)] border border-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}>
                    <Icon className="w-4 h-4" />
                    <span className="font-medium tracking-wide">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

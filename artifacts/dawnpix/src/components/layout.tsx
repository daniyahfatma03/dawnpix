import React from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col pt-4 px-4 pb-12 sm:p-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-8 bg-white/50 backdrop-blur-md rounded-full px-6 py-3 shadow-sm border border-white">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <div className="bg-primary text-white p-2 rounded-xl rotate-[-5deg] shadow-sm">
            <Camera size={24} />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-foreground">Dawn<span className="text-primary">Pix</span></span>
        </Link>
        <div className="flex items-center gap-2 text-sm font-semibold text-secondary-foreground bg-secondary/30 px-4 py-1.5 rounded-full">
          <Sparkles size={16} className="text-secondary-foreground" />
          <span>v1.0</span>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}

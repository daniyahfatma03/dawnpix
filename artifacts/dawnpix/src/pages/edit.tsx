import React, { useRef } from 'react';
import { useLocation } from 'wouter';
import { Layout } from '@/components/layout';
import { PhotoStrip } from '@/components/photo-strip';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSessionStore, MoodFilter, FrameTheme } from '@/store/use-session-store';
import { Sparkles, Palette, Frame, Type, ArrowRight, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const FILTERS: { id: MoodFilter; label: string; color: string }[] = [
  { id: 'none', label: 'Normal', color: 'bg-slate-200' },
  { id: 'dreamy', label: 'Dreamy', color: 'bg-pink-200' },
  { id: 'vintage', label: 'Vintage', color: 'bg-orange-200' },
  { id: 'y2k', label: 'Y2K', color: 'bg-fuchsia-300' },
  { id: 'dark', label: 'Moody', color: 'bg-slate-800' },
  { id: 'cute', label: 'Cute', color: 'bg-rose-300' },
];

const FRAMES: { id: FrameTheme; label: string; previewClass: string }[] = [
  { id: 'none', label: 'Classic', previewClass: 'bg-white border-2 border-slate-200' },
  { id: 'holiday', label: 'Holiday', previewClass: 'frame-holiday' },
  { id: 'summer', label: 'Summer', previewClass: 'frame-summer' },
  { id: 'birthday', label: 'Birthday', previewClass: 'frame-birthday' },
];

export default function Edit() {
  const [, setLocation] = useLocation();
  const { filter, frame, overlayText, hasSparkles, setEditOptions, photos } = useSessionStore();

  if (photos.length === 0) {
    // Redirect if accessed directly without photos
    setTimeout(() => setLocation('/'), 0);
    return null;
  }

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto w-full">
        
        {/* Left: Preview */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex justify-center lg:sticky lg:top-24 h-fit"
        >
          <PhotoStrip />
        </motion.div>

        {/* Right: Controls */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-6"
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold text-foreground">Make it Yours ✨</h1>
            <p className="text-muted-foreground">Add filters, frames, and sparkles to your strip.</p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Filters */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-display font-bold text-lg">
                  <Palette className="text-primary" size={20} />
                  <span>Mood Filter</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setEditOptions({ filter: f.id })}
                      className={cn(
                        "flex flex-col items-center gap-1 min-w-[70px] transition-all",
                        filter === f.id ? "scale-110" : "opacity-70 hover:opacity-100"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-full border-2 shadow-sm flex items-center justify-center",
                        f.color,
                        filter === f.id ? "border-primary shadow-primary/30" : "border-white"
                      )}>
                        {filter === f.id && <Wand2 size={16} className="text-white drop-shadow-md" />}
                      </div>
                      <span className="text-xs font-semibold">{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border w-full" />

              {/* Frames */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-display font-bold text-lg">
                  <Frame className="text-secondary" size={20} />
                  <span>Seasonal Frame</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {FRAMES.map((fr) => (
                    <button
                      key={fr.id}
                      onClick={() => setEditOptions({ frame: fr.id })}
                      className={cn(
                        "p-1 rounded-xl transition-all duration-200",
                        frame === fr.id ? "bg-primary shadow-md" : "bg-transparent hover:bg-slate-100"
                      )}
                    >
                      <div className={cn("w-full h-16 rounded-lg", fr.previewClass)} />
                      <p className={cn(
                        "text-xs font-bold mt-1 text-center",
                        frame === fr.id ? "text-white" : "text-slate-600"
                      )}>{fr.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border w-full" />

              {/* Text Overlay */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-display font-bold text-lg">
                  <Type className="text-accent" size={20} />
                  <span>Custom Text</span>
                </div>
                <Input 
                  placeholder="Enter a fun quote or location..." 
                  value={overlayText}
                  onChange={(e) => setEditOptions({ overlayText: e.target.value })}
                  maxLength={30}
                />
              </div>

              <div className="h-px bg-border w-full" />

              {/* Sparkles Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-display font-bold text-lg">
                  <Sparkles className="text-yellow-400" size={20} />
                  <span>Glitter Effect</span>
                </div>
                <button
                  onClick={() => setEditOptions({ hasSparkles: !hasSparkles })}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    hasSparkles ? "bg-yellow-400" : "bg-slate-200"
                  )}
                >
                  <motion.div 
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                    animate={{ left: hasSparkles ? '26px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

            </CardContent>
          </Card>

          <Button 
            size="lg" 
            className="w-full h-16 text-lg" 
            onClick={() => setLocation('/result')}
          >
            Looking Good! <ArrowRight className="ml-2" />
          </Button>

        </motion.div>
      </div>
    </Layout>
  );
}

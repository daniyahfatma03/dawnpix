import React from 'react';
import { useLocation } from 'wouter';
import { Layout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/store/use-session-store';
import { motion } from 'framer-motion';
import { Grid2x2, Grid3x3, Images, Clock, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Setup() {
  const [, setLocation] = useLocation();
  const { layout, countdown, burstMode, setSetup } = useSessionStore();

  const handleStart = () => {
    setLocation('/capture');
  };

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto w-full space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display font-bold text-foreground">Set the Vibe</h1>
          <p className="text-muted-foreground">Customize your photobooth experience before we start snapping.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Layout Selection */}
          <Card className="sm:col-span-2">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 font-display font-bold text-lg text-foreground">
                <Grid3x3 className="text-primary" />
                <span>Strip Layout</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSetup(num, countdown, burstMode)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200",
                      layout === num 
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/20 scale-105" 
                        : "border-transparent bg-slate-50 hover:bg-slate-100 text-slate-500"
                    )}
                  >
                    <div className="flex flex-col gap-1 mb-2">
                      {Array.from({ length: num }).map((_, i) => (
                        <div key={i} className={cn(
                          "w-6 h-8 rounded-sm bg-current opacity-80",
                          layout === num ? "bg-primary" : ""
                        )} />
                      ))}
                    </div>
                    <span className="font-bold">{num} Photos</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Countdown Selection */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 font-display font-bold text-lg text-foreground">
                <Clock className="text-secondary" />
                <span>Timer</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 10].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setSetup(layout, sec, burstMode)}
                    className={cn(
                      "py-3 rounded-xl font-bold transition-all",
                      countdown === sec
                        ? "bg-secondary text-secondary-foreground shadow-md shadow-secondary/30 scale-105"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Burst Mode Toggle */}
          <Card>
            <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-display font-bold text-lg text-foreground">
                  <Zap className="text-accent" />
                  <span>Burst Mode</span>
                </div>
                <button
                  onClick={() => setSetup(layout, countdown, !burstMode)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    burstMode ? "bg-accent" : "bg-slate-200"
                  )}
                >
                  <motion.div 
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                    animate={{ left: burstMode ? '26px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Take 3 rapid shots for each frame and pick your favorite one!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-4">
          <Button size="lg" onClick={handleStart} className="w-full sm:w-auto min-w-[200px] animate-pulse-fast">
            Let's Go! <ArrowRight className="ml-2" />
          </Button>
        </div>
      </motion.div>
    </Layout>
  );
}

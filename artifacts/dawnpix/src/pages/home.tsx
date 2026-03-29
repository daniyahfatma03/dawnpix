import React from 'react';
import { Link } from 'wouter';
import { useGetDailyTheme } from '@workspace/api-client-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Camera, Heart, ArrowRight } from 'lucide-react';
import { useSessionStore } from '@/store/use-session-store';

export default function Home() {
  const { data: dailyTheme, isLoading } = useGetDailyTheme();
  const resetSession = useSessionStore(s => s.reset);

  // Reset session when arriving home
  React.useEffect(() => {
    resetSession();
  }, [resetSession]);

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full gap-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-block animate-float mb-4">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold font-sans uppercase tracking-wider flex items-center gap-2">
              <Camera size={14} /> DawnPix Photobooth <Camera size={14} />
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-sans font-extrabold text-foreground leading-tight drop-shadow-sm">
            Capture Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
              Beautiful Moments
            </span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-lg mx-auto">
            A soft, dreamy photobooth for your most beautiful memories.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <Card className="bg-white border-primary/10 shadow-sm overflow-hidden relative">
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-primary font-bold">
                  <Heart size={20} className="fill-current text-primary" />
                  <span>Today's Theme</span>
                </div>
                {isLoading ? (
                  <div className="h-16 flex items-center justify-center sm:justify-start">
                    <span className="animate-pulse text-muted-foreground">Loading theme...</span>
                  </div>
                ) : dailyTheme ? (
                  <>
                    <h3 className="text-2xl font-sans font-bold">{dailyTheme.emoji} {dailyTheme.title}</h3>
                    <p className="text-muted-foreground text-sm">{dailyTheme.description}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Could not load today's theme.</p>
                )}
              </div>
              
              <Link href="/setup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto group">
                  Start Session
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          <Link href="/gallery">
            <Button variant="outline" className="bg-white/80 backdrop-blur">
              <Camera className="mr-2 h-4 w-4" />
              View Gallery
            </Button>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}

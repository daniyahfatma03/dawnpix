import React, { useRef, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Layout } from '@/components/layout';
import { PhotoStrip } from '@/components/photo-strip';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/store/use-session-store';
import { useCreateSession } from '@workspace/api-client-react';
import { toJpeg } from 'html-to-image';
import { motion } from 'framer-motion';
import { Download, Share2, Home, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Result() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const store = useSessionStore();
  const stripRef = useRef<HTMLDivElement>(null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const createSession = useCreateSession({
    mutation: {
      onSuccess: () => {
        setIsSaved(true);
        toast({
          title: "Saved to Gallery! 💖",
          description: "Your photobooth strip is now public.",
        });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Oops!",
          description: "Failed to save session to gallery.",
        });
      }
    }
  });

  if (store.photos.length === 0) {
    setTimeout(() => setLocation('/'), 0);
    return null;
  }

  const handleDownload = async () => {
    if (!stripRef.current) return;
    try {
      setIsDownloading(true);
      // Wait a tiny bit for any layout shifts
      await new Promise(r => setTimeout(r, 100));
      
      const dataUrl = await toJpeg(stripRef.current, { 
        quality: 0.95,
        pixelRatio: 2, // High res
        // Remove interactive sparkle animations for static download to avoid artifacts
        filter: (node) => {
          if (node.tagName === 'svg' && node.parentElement?.classList.contains('mix-blend-screen')) {
             return false;
          }
          return true;
        }
      });
      
      const link = document.createElement('a');
      link.download = `dawnpix-${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Downloaded! 📸",
        description: "Your photo strip has been saved to your device.",
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Something went wrong generating the image.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveToGallery = () => {
    createSession.mutate({
      data: {
        stripLayout: store.layout,
        filter: store.filter !== 'none' ? store.filter : undefined,
        frame: store.frame !== 'none' ? store.frame : undefined,
        overlayText: store.overlayText || undefined,
        hasSparkles: store.hasSparkles,
        dailyTheme: store.dailyThemeId,
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display font-bold text-foreground">Ta-da! 🎉</h1>
          <p className="text-muted-foreground">Your masterpiece is ready.</p>
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {/* We pass ref to PhotoStrip so html-to-image can capture it */}
          <PhotoStrip ref={stripRef} />
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
        >
          <Button 
            size="lg" 
            className="flex-1" 
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? <Loader2 className="mr-2 animate-spin" /> : <Download className="mr-2" />}
            Save Image
          </Button>
          
          <Button 
            size="lg" 
            variant="secondary" 
            className="flex-1"
            onClick={handleSaveToGallery}
            disabled={isSaved || createSession.isPending}
          >
            {createSession.isPending ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : isSaved ? (
              <CheckCircle2 className="mr-2 text-green-600" />
            ) : (
              <Share2 className="mr-2" />
            )}
            {isSaved ? "Saved" : "Post to Gallery"}
          </Button>
        </motion.div>

        <Link href="/">
          <Button variant="ghost" className="text-muted-foreground">
            <Home className="mr-2 h-4 w-4" /> Back to Start
          </Button>
        </Link>
      </div>
    </Layout>
  );
}

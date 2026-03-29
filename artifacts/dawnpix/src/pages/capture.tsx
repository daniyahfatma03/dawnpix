import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useCamera } from '@/hooks/use-camera';
import { useSessionStore } from '@/store/use-session-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CaptureState = 'init' | 'idle' | 'countdown' | 'flash' | 'burst_review' | 'done';

export default function Capture() {
  const [, setLocation] = useLocation();
  const { layout, countdown, burstMode, addPhoto } = useSessionStore();
  const { videoRef, startCamera, stopCamera, capture, isReady, error } = useCamera();
  
  const [currentShot, setCurrentShot] = useState(1);
  const [captureState, setCaptureState] = useState<CaptureState>('init');
  const [count, setCount] = useState(countdown);
  const [burstOptions, setBurstOptions] = useState<string[]>([]);

  // Init camera
  useEffect(() => {
    startCamera().then(() => setCaptureState('idle'));
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const startNextShot = () => {
    if (currentShot > layout) {
      setCaptureState('done');
      setTimeout(() => setLocation('/edit'), 500);
      return;
    }
    setCount(countdown);
    setCaptureState('countdown');
  };

  // Handle Countdown
  useEffect(() => {
    if (captureState !== 'countdown') return;
    
    if (count > 0) {
      const timer = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCaptureState('flash');
      performCapture();
    }
  }, [captureState, count]);

  const performCapture = async () => {
    if (burstMode) {
      // Rapid fire 3 shots
      const shots: string[] = [];
      for (let i = 0; i < 3; i++) {
        const photo = capture();
        if (photo) shots.push(photo);
        await new Promise(r => setTimeout(r, 400)); // 400ms delay between burst shots
      }
      setBurstOptions(shots);
      setCaptureState('burst_review');
    } else {
      // Single shot
      const photo = capture();
      if (photo) addPhoto(photo);
      setTimeout(() => {
        setCurrentShot(s => s + 1);
        setCaptureState('idle');
      }, 500); // Short delay to show flash
    }
  };

  const selectBurstPhoto = (photo: string) => {
    addPhoto(photo);
    setCurrentShot(s => s + 1);
    setBurstOptions([]);
    setCaptureState('idle');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-white p-8 rounded-3xl text-center max-w-md w-full shadow-xl">
          <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera size={32} />
          </div>
          <h2 className="text-xl font-bold mb-2">Camera Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => setLocation('/')} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 z-50 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold font-display">
          Shot {Math.min(currentShot, layout)} of {layout}
        </div>
        <button 
          onClick={() => { stopCamera(); setLocation('/'); }}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-full transition"
        >
          <X size={24} />
        </button>
      </div>

      {/* Video Feed */}
      <div className="flex-1 relative flex items-center justify-center">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted
          className="w-full h-full object-cover max-w-[100vw] sm:max-w-[calc(100vh*0.75)] aspect-[3/4] bg-slate-900 scale-x-[-1]"
        />

        {/* Overlays */}
        <AnimatePresence>
          {captureState === 'countdown' && (
            <motion.div
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <span className="text-[150px] font-display font-black text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                {count}
              </span>
            </motion.div>
          )}

          {captureState === 'flash' && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-white z-30 pointer-events-none"
            />
          )}

          {captureState === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-12 left-0 right-0 flex justify-center z-20"
            >
              <Button size="lg" onClick={startNextShot} className="rounded-full h-16 px-10 text-xl shadow-[0_0_40px_rgba(255,105,180,0.4)]">
                <Camera className="mr-2" size={28} /> Take Photo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Burst Review Modal */}
        <AnimatePresence>
          {captureState === 'burst_review' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            >
              <div className="max-w-2xl w-full text-center space-y-6">
                <h2 className="text-3xl font-display font-bold text-white drop-shadow-md">Pick Your Favorite! ✨</h2>
                <div className="grid grid-cols-3 gap-4">
                  {burstOptions.map((photo, i) => (
                    <motion.button
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectBurstPhoto(photo)}
                      className="aspect-[3/4] rounded-xl overflow-hidden border-4 border-transparent hover:border-primary focus:border-primary transition-all shadow-xl"
                    >
                      <img src={photo} alt={`Burst option ${i}`} className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

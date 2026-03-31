import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { useCamera } from '@/hooks/use-camera';
import { useSessionStore } from '@/store/use-session-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CaptureState = 'loading' | 'idle' | 'countdown' | 'flash' | 'burst_review' | 'done';

export default function Capture() {
  const [, setLocation] = useLocation();
  const { layout, countdown, burstMode, addPhoto } = useSessionStore();
  const { videoRef, startCamera, stopCamera, capture, isReady, error } = useCamera();

  const [currentShot, setCurrentShot] = useState(1);
  const [captureState, setCaptureState] = useState<CaptureState>('loading');
  const [count, setCount] = useState(countdown);
  const [burstOptions, setBurstOptions] = useState<string[]>([]);

  // Store countdown and burstMode in refs so callbacks always have fresh values
  const countdownRef = useRef(countdown);
  const burstModeRef = useRef(burstMode);
  const captureRef = useRef(capture);
  const addPhotoRef = useRef(addPhoto);
  const currentShotRef = useRef(currentShot);
  const layoutRef = useRef(layout);

  useEffect(() => { countdownRef.current = countdown; }, [countdown]);
  useEffect(() => { burstModeRef.current = burstMode; }, [burstMode]);
  useEffect(() => { captureRef.current = capture; }, [capture]);
  useEffect(() => { addPhotoRef.current = addPhoto; }, [addPhoto]);
  useEffect(() => { currentShotRef.current = currentShot; }, [currentShot]);
  useEffect(() => { layoutRef.current = layout; }, [layout]);

  // Init camera
  useEffect(() => {
    startCamera().then(() => {
      setCaptureState('idle');
    });
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNextShot = useCallback(() => {
    setCount(countdownRef.current);
    setCaptureState('countdown');
  }, []);

  const performCapture = useCallback(async () => {
    if (burstModeRef.current) {
      const shots: string[] = [];
      for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, i === 0 ? 0 : 400));
        const photo = captureRef.current();
        if (photo) shots.push(photo);
      }
      setBurstOptions(shots);
      setCaptureState('burst_review');
    } else {
      const photo = captureRef.current();
      if (photo) {
        addPhotoRef.current(photo);
        const next = currentShotRef.current + 1;
        setCurrentShot(next);
        if (next > layoutRef.current) {
          setCaptureState('done');
          setTimeout(() => setLocation('/edit'), 600);
        } else {
          setTimeout(() => setCaptureState('idle'), 500);
        }
      } else {
        // capture failed (video not ready), try again
        setTimeout(() => setCaptureState('idle'), 300);
      }
    }
  }, [setLocation]);

  // Countdown tick
  useEffect(() => {
    if (captureState !== 'countdown') return;

    let cleanup: (() => void) | undefined;

    if (count > 0) {
      const timer = setTimeout(() => setCount(c => c - 1), 1000);
      cleanup = () => clearTimeout(timer);
    } else {
      setCaptureState('flash');
      void performCapture();
    }

    return cleanup;
  }, [captureState, count, performCapture]);

  const selectBurstPhoto = useCallback((photo: string) => {
    addPhotoRef.current(photo);
    const next = currentShotRef.current + 1;
    setCurrentShot(next);
    setBurstOptions([]);
    if (next > layoutRef.current) {
      setCaptureState('done');
      setTimeout(() => setLocation('/edit'), 600);
    } else {
      setCaptureState('idle');
    }
  }, [setLocation]);

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
      <div className="absolute top-0 left-0 right-0 p-6 z-50 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold">
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

        {/* Loading overlay */}
        {captureState === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 gap-4">
            <Loader2 className="animate-spin text-white" size={48} />
            <p className="text-white text-lg font-medium">Starting camera...</p>
          </div>
        )}

        <AnimatePresence>
          {captureState === 'countdown' && (
            <motion.div
              key={count}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <span className="text-[160px] font-black text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] leading-none">
                {count === 0 ? '📸' : count}
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
              exit={{ opacity: 0 }}
              className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3 z-20"
            >
              {!isReady ? (
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white px-5 py-3 rounded-full">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Warming up camera...</span>
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={startNextShot}
                  className="rounded-full h-16 px-10 text-xl shadow-xl"
                >
                  <Camera className="mr-2" size={28} /> Take Photo
                </Button>
              )}
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
                <h2 className="text-3xl font-bold text-white drop-shadow-md">Pick Your Favorite!</h2>
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
                      <img src={photo} alt={`Burst option ${i + 1}`} className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
                <p className="text-white/70 text-sm">Tap the photo you like best</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

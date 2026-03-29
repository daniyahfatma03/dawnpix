import { useState, useRef, useCallback, useEffect } from 'react';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setIsReady(false);
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1080 },
          height: { ideal: 1440 },
        },
        audio: false,
      });

      streamRef.current = mediaStream;

      const video = videoRef.current;
      if (!video) return;

      video.srcObject = mediaStream;

      // Wait for the video to actually be ready to play before resolving
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.play().then(resolve).catch(reject);
        };
        video.onerror = () => reject(new Error("Video error"));
        // Fallback timeout in case events don't fire
        setTimeout(resolve, 3000);
      });

      setIsReady(true);
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("Please allow camera access to use the photobooth! 📸");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsReady(false);
  }, []);

  const capture = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return null;
    if (video.readyState < 2) return null; // HAVE_CURRENT_DATA check

    const targetRatio = 3 / 4;
    const videoRatio = video.videoWidth / video.videoHeight;

    let drawWidth = video.videoWidth;
    let drawHeight = video.videoHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (videoRatio > targetRatio) {
      drawWidth = video.videoHeight * targetRatio;
      offsetX = (video.videoWidth - drawWidth) / 2;
    } else {
      drawHeight = video.videoWidth / targetRatio;
      offsetY = (video.videoHeight - drawHeight) / 2;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Mirror horizontally so it looks like a real mirror
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(
      video,
      offsetX, offsetY, drawWidth, drawHeight,
      0, 0, canvas.width, canvas.height
    );

    return canvas.toDataURL('image/jpeg', 0.92);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    startCamera,
    stopCamera,
    capture,
    error,
    isReady,
  };
}

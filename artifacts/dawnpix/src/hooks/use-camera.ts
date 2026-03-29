import { useState, useRef, useCallback, useEffect } from 'react';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 1080 },
          height: { ideal: 1440 } // 3:4 aspect ratio preference
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("Please allow camera access to use the photobooth! 📸");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capture = useCallback(() => {
    if (!videoRef.current) return null;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    // Target a 3:4 portrait aspect ratio
    const targetRatio = 3/4;
    const videoRatio = video.videoWidth / video.videoHeight;
    
    let drawWidth = video.videoWidth;
    let drawHeight = video.videoHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (videoRatio > targetRatio) {
      // Video is wider than 3:4 (e.g., 16:9 landscape)
      drawWidth = video.videoHeight * targetRatio;
      offsetX = (video.videoWidth - drawWidth) / 2;
    } else {
      // Video is taller than 3:4
      drawHeight = video.videoWidth / targetRatio;
      offsetY = (video.videoHeight - drawHeight) / 2;
    }

    canvas.width = 600;  // Standardized output width
    canvas.height = 800; // Standardized output height
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Mirror the image horizontally so it acts like a mirror
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    
    ctx.drawImage(
      video,
      offsetX, offsetY, drawWidth, drawHeight, // Source crop
      0, 0, canvas.width, canvas.height // Destination
    );
    
    return canvas.toDataURL('image/jpeg', 0.9);
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
    isReady: !!stream
  };
}

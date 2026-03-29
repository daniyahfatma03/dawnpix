import React from 'react';
import { motion } from 'framer-motion';

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 160 160" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M80 0C80 0 84.2846 41.2965 105.181 62.1934C126.078 83.0898 160 80 160 80C160 80 118.703 84.2846 97.8066 105.181C76.9102 126.078 80 160 80 160C80 160 75.7154 118.703 54.819 97.8066C33.9226 76.9102 0 80 0 80C0 80 41.2965 75.7154 62.1934 54.819C83.0898 33.9226 80 0 80 0Z" 
      fill="currentColor"
    />
  </svg>
);

export function Sparkles({ enabled = true }: { enabled?: boolean }) {
  if (!enabled) return null;

  // Generate deterministic but random-looking positions
  const sparkles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: 10 + (Math.random() * 20),
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    color: ['#FF69B4', '#8A2BE2', '#00FFFF', '#FFD700', '#FFFFFF'][Math.floor(Math.random() * 5)]
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50 mix-blend-screen">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ top: s.top, left: s.left }}
          animate={{
            scale: [0, 1.2, 0],
            rotate: [0, 90, 180],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut"
          }}
        >
          <SparkleIcon 
            className="drop-shadow-lg"
            style={{ 
              width: s.size, 
              height: s.size, 
              color: s.color 
            }} 
          />
        </motion.div>
      ))}
    </div>
  );
}

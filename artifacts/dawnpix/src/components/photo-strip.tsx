import React, { forwardRef } from 'react';
import { useSessionStore } from '@/store/use-session-store';
import { Sparkles } from './sparkles';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface PhotoStripProps {
  className?: string;
  showEmptySlots?: boolean;
}

export const PhotoStrip = forwardRef<HTMLDivElement, PhotoStripProps>(
  ({ className, showEmptySlots = true }, ref) => {
    const { layout, photos, filter, frame, overlayText, hasSparkles } = useSessionStore();

    // Create array of correct length, padded with nulls if empty slots shown
    const slots = Array.from({ length: layout }).map((_, i) => photos[i] || null);
    
    // Filter map matching index.css
    const filterClass = filter !== 'none' ? `filter-${filter}` : '';

    return (
      <div 
        ref={ref}
        className={cn(
          "relative mx-auto w-full max-w-[300px] overflow-hidden shadow-2xl transition-all duration-300",
          `frame-${frame}`,
          className
        )}
      >
        <Sparkles enabled={hasSparkles} />
        
        <div className="flex flex-col gap-3 relative z-10">
          {slots.map((src, idx) => (
            <div 
              key={idx} 
              className={cn(
                "aspect-[3/4] w-full bg-slate-200 rounded-sm overflow-hidden relative shadow-inner",
                !src && showEmptySlots ? "animate-pulse" : ""
              )}
            >
              {src ? (
                <img 
                  src={src} 
                  alt={`Shot ${idx + 1}`}
                  className={cn("w-full h-full object-cover", filterClass)}
                />
              ) : (
                showEmptySlots && (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-display text-2xl opacity-50">
                    {idx + 1}
                  </div>
                )
              )}
            </div>
          ))}

          {/* Bottom space for branding or custom text */}
          <div className="pt-2 pb-4 text-center min-h-[80px] flex flex-col items-center justify-center">
            <p className="font-display font-bold text-xl text-foreground/80 tracking-wide mb-1">DawnPix</p>
            {overlayText ? (
              <p className="font-sans font-medium text-sm text-primary max-w-full break-words px-2 leading-tight">
                {overlayText}
              </p>
            ) : (
              <p className="font-sans text-xs text-muted-foreground">
                {format(new Date(), 'MMM do, yyyy')}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);
PhotoStrip.displayName = 'PhotoStrip';

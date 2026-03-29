import React from 'react';
import { useListSessions } from '@workspace/api-client-react';
import { Layout } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Camera, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Gallery() {
  const { data: sessions, isLoading, isError } = useListSessions();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display font-bold text-foreground">Community Gallery 🌟</h1>
          <p className="text-muted-foreground">See what others have been creating!</p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/50 animate-pulse rounded-2xl" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center p-12 bg-white/50 rounded-3xl border-2 border-dashed border-red-200 text-red-500">
            <AlertCircle className="mx-auto mb-4" size={32} />
            <p className="font-bold font-display">Oops! Couldn't load gallery.</p>
          </div>
        )}

        {sessions && sessions.length === 0 && (
          <div className="text-center p-12 bg-white/50 rounded-3xl border-2 border-dashed border-primary/20 text-muted-foreground">
            <Camera className="mx-auto mb-4 opacity-50" size={32} />
            <p className="font-bold font-display">No sessions yet.</p>
            <p className="text-sm">Be the first to post a photobooth strip!</p>
          </div>
        )}

        {sessions && sessions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sessions.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* 
                  Since we don't save actual image binary data to the DB (just metadata in this schema),
                  we render a visually representative placeholder based on their choices. 
                  In a full app, this would be the uploaded image URL.
                */}
                <Card className="overflow-hidden group hover:-translate-y-1 transition-transform cursor-pointer">
                  <div className={cn(
                    "aspect-[3/4] w-full p-4 flex flex-col justify-between relative",
                    session.frame ? `frame-${session.frame}` : 'bg-slate-100'
                  )}>
                    {session.hasSparkles && (
                      <div className="absolute top-2 right-2 text-yellow-400 opacity-80 animate-pulse">
                        <Sparkles size={24} />
                      </div>
                    )}
                    
                    <div className="flex-1 flex flex-col gap-2">
                      {Array.from({ length: session.stripLayout }).map((_, idx) => (
                        <div key={idx} className={cn(
                          "flex-1 bg-slate-300 rounded-sm w-full flex items-center justify-center overflow-hidden",
                          session.filter ? `filter-${session.filter}` : ''
                        )}>
                           <Camera className="text-slate-400 opacity-30" size={24} />
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-center bg-white/80 backdrop-blur-sm mt-2 rounded p-1">
                      <p className="font-display font-bold text-sm text-foreground">DawnPix</p>
                      <p className="font-sans text-[10px] text-muted-foreground truncate">
                        {session.overlayText || format(new Date(session.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

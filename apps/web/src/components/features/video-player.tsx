'use client';

import * as React from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoUrl {
  url: string;
  title?: string;
}

interface VideoPlayerProps {
  videos?: VideoUrl[];
  playlistId?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function VideoPlayer({ videos = [], playlistId, title, subtitle, className = '' }: VideoPlayerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('embed')) return url;
    
    let videoId = '';
    if (url.includes('youtube.com/watch')) {
      const params = new URL(url).searchParams;
      videoId = params.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const nextVideo = () => {
    if (videos.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }
  };

  const prevVideo = () => {
    if (videos.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    }
  };

  const currentVideo = videos[currentIndex];

  if (!currentVideo && !playlistId) {
    return null;
  }

  const embedUrl = playlistId 
    ? `https://www.youtube.com/embed/videoseries?list=${playlistId}`
    : getEmbedUrl(currentVideo?.url);

  return (
    <div className={`space-y-4 ${className}`}>
      {(title || subtitle) && (
        <div className="text-center">
          {title && <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      )}
      
      <div className="relative">
        <div className="absolute inset-0 -m-4 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl blur-xl opacity-50" />
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-900">
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title={title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {videos.length > 1 && !playlistId && (
          <>
            <button
              onClick={prevVideo}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextVideo}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next video"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      
      {videos.length > 1 && !playlistId && (
        <div className="flex justify-center gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary w-8' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export function AnalyticsScript() {
  useEffect(() => {
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    window.dataLayer = window.dataLayer || [];
    
    // Initialize gtag
    const gtagFn = (...args: any[]) => {
      window.dataLayer.push(args);
    };
    
    (window as any).gtag = gtagFn;
    gtagFn('js', new Date());
    gtagFn('config', GA_MEASUREMENT_ID);
  }, []);

  return null;
}
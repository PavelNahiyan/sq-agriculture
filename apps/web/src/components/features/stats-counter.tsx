'use client';

import * as React from 'react';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

interface StatsCounterProps {
  stats: Stat[];
  className?: string;
}

export function StatsCounter({ stats, className = '' }: StatsCounterProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [counters, setCounters] = React.useState(stats.map(() => 0));
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const animators = stats.map((stat, index) => {
      let current = 0;
      const increment = stat.value / steps;

      return setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(animators[index]);
        }
        setCounters(prev => {
          const newCounters = [...prev];
          newCounters[index] = Math.floor(current);
          return newCounters;
        });
      }, interval);
    });

    return () => {
      animators.forEach(timer => clearInterval(timer));
    };
  }, [isVisible, stats]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K+';
    }
    return num.toString();
  };

  return (
    <div ref={ref} className={`grid grid-cols-2 md:grid-cols-4 gap-8 text-center ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="space-y-2">
          <div className="text-4xl md:text-5xl font-bold text-primary">
            {formatNumber(counters[index])}
            {stat.suffix && <span className="text-2xl">{stat.suffix}</span>}
          </div>
          <div className="text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
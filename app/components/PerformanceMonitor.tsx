"use client";
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  pageLoadTime: number | null;
}

// Extended interfaces for performance entries
interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    pageLoadTime: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
      }
    });

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcpEntry = entries[entries.length - 1];
      if (lcpEntry) {
        setMetrics(prev => ({ ...prev, lcp: lcpEntry.startTime }));
      }
    });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fidEntry = entries[entries.length - 1] as FirstInputEntry;
      if (fidEntry && 'processingStart' in fidEntry) {
        setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime }));
      }
    });

    // Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        const layoutShiftEntry = entry as LayoutShiftEntry;
        if ('hadRecentInput' in layoutShiftEntry && !layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }
      setMetrics(prev => ({ ...prev, cls: clsValue }));
    });

    // Time to First Byte (TTFB)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }));
    }

    // Page Load Time
    const pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    setMetrics(prev => ({ ...prev, pageLoadTime }));

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getPerformanceScore = (metric: keyof PerformanceMetrics): string => {
    const value = metrics[metric];
    if (value === null) return 'N/A';

    switch (metric) {
      case 'fcp':
        return value < 1800 ? '🟢 Good' : value < 3000 ? '🟡 Needs Improvement' : '🔴 Poor';
      case 'lcp':
        return value < 2500 ? '🟢 Good' : value < 4000 ? '🟡 Needs Improvement' : '🔴 Poor';
      case 'fid':
        return value < 100 ? '🟢 Good' : value < 300 ? '🟡 Needs Improvement' : '🔴 Poor';
      case 'cls':
        return value < 0.1 ? '🟢 Good' : value < 0.25 ? '🟡 Needs Improvement' : '🔴 Poor';
      default:
        return 'N/A';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="font-bold mb-2 text-green-400">Performance Monitor</div>
      <div className="space-y-1">
        <div>FCP: {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A'} {getPerformanceScore('fcp')}</div>
        <div>LCP: {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'} {getPerformanceScore('lcp')}</div>
        <div>FID: {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A'} {getPerformanceScore('fid')}</div>
        <div>CLS: {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'} {getPerformanceScore('cls')}</div>
        <div>TTFB: {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A'}</div>
        <div>Load: {metrics.pageLoadTime ? `${Math.round(metrics.pageLoadTime)}ms` : 'N/A'}</div>
      </div>
    </div>
  );
}

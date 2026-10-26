import React, { useEffect, useRef, useState } from 'react';

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in ms (e.g. 0, 60, 120)
  duration?: number; // Duration in ms (default 280ms, snappy and subtle)
  offset?: number; // Vertical offset in px (default 10px, subtle)
  direction?: 'up' | 'none';
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 280,
  offset = 10,
  direction = 'up',
  once = true,
  as: Component = 'div',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setIsVisible(true);
        setIsFullyRevealed(true);
        return;
      }
    }

    // 2. Safe fallback if IntersectionObserver is not available (e.g. SSR / Node.js test environment)
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      setIsFullyRevealed(true);
      return;
    }

    const currentEl = elementRef.current;
    if (!currentEl) {
      setIsVisible(true);
      setIsFullyRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
            setIsFullyRevealed(false);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px',
      }
    );

    observer.observe(currentEl);

    return () => {
      observer.disconnect();
    };
  }, [once]);

  // Once the reveal animation completes, remove all transform and will-change styles
  // so that descendant elements and stacking contexts behave naturally without trapping overlays!
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsFullyRevealed(true);
      }, (delay || 0) + (duration || 280) + 40);
      return () => clearTimeout(timer);
    } else {
      setIsFullyRevealed(false);
    }
  }, [isVisible, delay, duration]);

  const Tag = Component as any;

  if (isFullyRevealed) {
    return (
      <Tag ref={elementRef} className={`opacity-100 ${className}`}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={elementRef}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isVisible
          ? 'none'
          : direction === 'up'
          ? `translate3d(0, ${offset}px, 0)`
          : 'none',
      }}
      className={`transition-all ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {children}
    </Tag>
  );
};

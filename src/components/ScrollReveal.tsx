import React, { useEffect, useRef, useState } from 'react';

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in ms (e.g. 0, 180, 360, 540)
  duration?: number; // Duration in ms (default 1400, range 1200-1500ms)
  offset?: number; // Vertical offset in px (default 22, range 20-24px)
  direction?: 'up' | 'none';
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 1400,
  offset = 22,
  direction = 'up',
  once = true,
  as: Component = 'div',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setIsVisible(true);
        return;
      }
    }

    // 2. Safe fallback if IntersectionObserver is not available (e.g. SSR / Node.js test environment)
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const currentEl = elementRef.current;
    if (!currentEl) {
      setIsVisible(true);
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
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -25px 0px',
      }
    );

    observer.observe(currentEl);

    return () => {
      observer.disconnect();
    };
  }, [once]);

  const Tag = Component as any;

  return (
    <Tag
      ref={elementRef}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isVisible
          ? 'translate3d(0, 0, 0)'
          : direction === 'up'
          ? `translate3d(0, ${offset}px, 0)`
          : 'none',
      }}
      className={`transition-all will-change-transform ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {children}
    </Tag>
  );
};

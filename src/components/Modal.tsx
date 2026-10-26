import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

let activeModalCount = 0;
let savedScrollY = 0;
let savedScrollX = 0;
let originalBodyOverflow = '';
let originalBodyPosition = '';
let originalBodyTop = '';
let originalBodyLeft = '';
let originalBodyWidth = '';
let originalBodyPaddingRight = '';
let originalHtmlOverflow = '';
let originalHtmlScrollBehavior = '';

export function getActiveModalCount(): number {
  return activeModalCount;
}

export function getSavedScrollY(): number {
  return savedScrollY;
}

export function resetScrollLockForTesting(): void {
  activeModalCount = 0;
  savedScrollY = 0;
  savedScrollX = 0;
}

export function lockBodyScroll(): void {
  if (typeof document === 'undefined') return;

  if (activeModalCount === 0) {
    // 1. Capture current scroll position across all browsers and devices
    const windowObj = typeof window !== 'undefined' ? window : null;
    const docEl = document.documentElement;
    const bodyEl = document.body;

    savedScrollY =
      windowObj?.scrollY ??
      windowObj?.pageYOffset ??
      docEl?.scrollTop ??
      bodyEl?.scrollTop ??
      0;

    savedScrollX =
      windowObj?.scrollX ??
      windowObj?.pageXOffset ??
      docEl?.scrollLeft ??
      bodyEl?.scrollLeft ??
      0;

    // 2. Compute scrollbar width before locking to prevent horizontal layout shift
    const scrollbarWidth =
      windowObj && docEl ? windowObj.innerWidth - docEl.clientWidth : 0;

    // 3. Save original inline styles to restore cleanly upon closing
    originalBodyOverflow = bodyEl?.style?.overflow || '';
    originalBodyPosition = bodyEl?.style?.position || '';
    originalBodyTop = bodyEl?.style?.top || '';
    originalBodyLeft = bodyEl?.style?.left || '';
    originalBodyWidth = bodyEl?.style?.width || '';
    originalBodyPaddingRight = bodyEl?.style?.paddingRight || '';
    originalHtmlOverflow = docEl?.style?.overflow || '';
    originalHtmlScrollBehavior = docEl?.style?.scrollBehavior || '';

    // 4. Compensate for scrollbar disappearance if present
    if (bodyEl?.style) {
      if (scrollbarWidth > 0) {
        bodyEl.style.paddingRight = `${scrollbarWidth}px`;
      }
      // 5. Freeze body position at the negative scroll offset
      // This is the gold-standard iOS Safari / mobile browser lock that prevents touch & momentum scroll bleed
      bodyEl.style.position = 'fixed';
      bodyEl.style.top = `-${savedScrollY}px`;
      bodyEl.style.left = `-${savedScrollX}px`;
      bodyEl.style.width = '100%';
      bodyEl.style.overflow = 'hidden';
    }

    // 6. Freeze root html element to prevent scroll chaining on desktop browsers
    if (docEl?.style) {
      docEl.style.overflow = 'hidden';
    }
  }

  activeModalCount++;
}

export function unlockBodyScroll(): void {
  if (typeof document === 'undefined') return;

  activeModalCount = Math.max(0, activeModalCount - 1);

  if (activeModalCount === 0) {
    const docEl = document.documentElement;
    const bodyEl = document.body;
    const windowObj = typeof window !== 'undefined' ? window : null;

    // 1. Temporarily disable smooth scrolling so scrollTo restores instantly without animation jitter
    if (docEl?.style) {
      docEl.style.scrollBehavior = 'auto';
    }

    // 2. Restore original styles to body and html
    if (bodyEl?.style) {
      bodyEl.style.position = originalBodyPosition;
      bodyEl.style.top = originalBodyTop;
      bodyEl.style.left = originalBodyLeft;
      bodyEl.style.width = originalBodyWidth;
      bodyEl.style.overflow = originalBodyOverflow;
      bodyEl.style.paddingRight = originalBodyPaddingRight;
    }

    if (docEl?.style) {
      docEl.style.overflow = originalHtmlOverflow;
    }

    // 3. Instantly restore exact scroll coordinates
    if (windowObj && typeof windowObj.scrollTo === 'function') {
      windowObj.scrollTo(savedScrollX, savedScrollY);
    }

    // 4. Restore original html scrollBehavior in the next event loop tick
    const restoredBehavior = originalHtmlScrollBehavior;
    if (docEl?.style) {
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => {
          if (docEl?.style) {
            docEl.style.scrollBehavior = restoredBehavior;
          }
        });
      } else {
        docEl.style.scrollBehavior = restoredBehavior;
      }
    }
  }
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string; // e.g. 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-3xl', 'max-w-4xl', 'max-w-5xl'
  className?: string;
  bodyClassName?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  ariaLabel?: string;
  showCloseButton?: boolean;
  zIndex?: string; // default 'z-[100]'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 'max-w-2xl',
  className = '',
  bodyClassName = 'p-4 sm:p-6 space-y-4 overflow-y-auto',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  ariaLabel,
  showCloseButton = true,
  zIndex = 'z-[100]',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const titleIdRef = useRef<string>('');

  if (!titleIdRef.current) {
    titleIdRef.current = `modal-title-${Math.random().toString(36).slice(2, 9)}`;
  }

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [isOpen]);

  // Capture active element before opening, focus dialog on mount, restore focus on close
  useEffect(() => {
    if (isOpen) {
      if (typeof document !== 'undefined') {
        previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
      }
      const focusTimer = setTimeout(() => {
        dialogRef.current?.focus();
      }, 50);
      return () => clearTimeout(focusTimer);
    } else if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus?.();
      previouslyFocusedElement.current = null;
    }
  }, [isOpen]);

  // Ensure focus is restored if component unmounts while open
  useEffect(() => {
    return () => {
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus?.();
        previouslyFocusedElement.current = null;
      }
    };
  }, []);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const content = (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center p-3 sm:p-4 overflow-hidden`}
      style={{ boxSizing: 'border-box', overscrollBehavior: 'contain' }}
      onWheel={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      {/* Viewport-covering subtle neutral backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200 modal-backdrop-animate"
        onClick={closeOnBackdropClick ? onClose : undefined}
        onTouchMove={(e) => e.preventDefault()}
        onWheel={(e) => e.preventDefault()}
        style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
        aria-hidden="true"
      />

      {/* Centered Dialog card */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleIdRef.current : undefined}
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`relative bg-white dark:bg-slate-900 rounded-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[90vh] z-10 my-auto focus:outline-none modal-content-animate ${maxWidth} ${className}`}
        onClick={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Optional Header */}
        {(title || showCloseButton) && (
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40 shrink-0">
            <div className="flex items-center space-x-2.5 min-w-0">
              {icon && <div className="shrink-0">{icon}</div>}
              <div className="min-w-0">
                {title && (
                  <h3
                    id={titleIdRef.current}
                    className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight truncate"
                  >
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div
          className={`flex-1 min-h-0 ${bodyClassName}`}
          style={{
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'right' | 'left';
  maxWidth?: string; // default 'sm:max-w-md'
  zIndex?: string; // default 'z-[100]'
  ariaLabel?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  position = 'right',
  maxWidth = 'sm:max-w-md',
  zIndex = 'z-[100]',
  ariaLabel = 'Side Drawer',
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [isOpen]);

  // Capture active element before opening, focus drawer on mount, restore focus on close
  useEffect(() => {
    if (isOpen) {
      if (typeof document !== 'undefined') {
        previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
      }
      const focusTimer = setTimeout(() => {
        drawerRef.current?.focus();
      }, 50);
      return () => clearTimeout(focusTimer);
    } else if (previouslyFocusedElement.current) {
      previouslyFocusedElement.current.focus?.();
      previouslyFocusedElement.current = null;
    }
  }, [isOpen]);

  // Ensure focus is restored if component unmounts while open
  useEffect(() => {
    return () => {
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus?.();
        previouslyFocusedElement.current = null;
      }
    };
  }, []);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const content = (
    <div
      className={`fixed inset-0 ${zIndex} overflow-hidden`}
      style={{ boxSizing: 'border-box', overscrollBehavior: 'contain' }}
      onWheel={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      {/* Viewport-covering subtle neutral backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200 modal-backdrop-animate"
        onClick={closeOnBackdropClick ? onClose : undefined}
        onTouchMove={(e) => e.preventDefault()}
        onWheel={(e) => e.preventDefault()}
        style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
        aria-hidden="true"
      />

      <div className={`fixed inset-y-0 ${position === 'right' ? 'right-0 pl-4 sm:pl-10' : 'left-0 pr-4 sm:pr-10'} max-w-full flex`}>
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          tabIndex={-1}
          className={`w-screen max-w-[calc(100vw-1rem)] ${maxWidth} bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col relative z-10 h-full focus:outline-none drawer-content-animate`}
          onClick={(e) => e.stopPropagation()}
          style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

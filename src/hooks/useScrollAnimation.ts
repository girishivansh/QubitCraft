import { useEffect, useRef, useCallback } from 'react';

const ANIMATION_SELECTORS = [
  '.scroll-animate',
  '.scroll-fade',
  '.scroll-scale',
  '.scroll-slide-left',
  '.scroll-slide-right',
  '.scroll-trigger',
].join(', ');

/**
 * Enhanced scroll animation hook.
 * Uses IntersectionObserver to trigger reveal animations.
 * Supports multiple animation variants:
 *   - scroll-animate (fade up)
 *   - scroll-fade (fade in)
 *   - scroll-scale (scale up)
 *   - scroll-slide-left / scroll-slide-right
 *
 * Works with Lenis smooth scroll for buttery-smooth reveal timing.
 */
export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  const observe = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.classList.add('is-visible');
            });
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    const targets = el.querySelectorAll(ANIMATION_SELECTORS);
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = observe();
    return cleanup;
  }, [observe]);

  return ref;
}

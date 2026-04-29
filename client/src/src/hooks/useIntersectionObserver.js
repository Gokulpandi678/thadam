import { useEffect, useRef } from "react";

/**
 * useIntersectionObserver
 *
 * Returns a ref to attach to the sentinel element.
 *
 * @param {object} options
 * @param {() => void} options.onIntersect   - Called when sentinel enters view
 * @param {boolean}    options.enabled       - Whether observation is active
 * @param {React.RefObject} [options.root]   - Scroll container ref (default: viewport)
 * @param {string}  [options.rootMargin]     - Margin around root (default: "0px")
 * @param {number}  [options.threshold]      - Intersection threshold (default: 0)
 */
const useIntersectionObserver = ({
  onIntersect,
  enabled = true,
  root,
  rootMargin = "0px",
  threshold = 0,
}) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      {
        root: root?.current ?? null,  // null = viewport; ref.current = scroll container
        rootMargin,
        threshold,
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [enabled, onIntersect, root, rootMargin, threshold]);

  return sentinelRef;
};

export default useIntersectionObserver;
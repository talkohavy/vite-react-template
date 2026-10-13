import { useEffect, useRef } from 'react';

/**
 * @description
 *
 * Scrolls to the bottom of the **root** container when the height of the **content** container changes.
 *
 * Prerequisites:
 *
 * - The root container MUST HAVE either a fixed height or a max-height.
 * - The root container MUST HAVE only one div child element (the content container).
 * - Items are being added to the content container!
 *
 * What grows is the **content** container's height, not the **root** container's height.
 *
 *
 * @example
 * ```tsx
 * const { scrollRootRef } = useScrollToBottomOnHeightChange();
 *
 * return (
 *   <div ref={scrollRootRef} className='root-container'>
 *     <div className='content-container'>
 *       <p>item 1</p>
 *       <p>item 2</p>
 *       <p>item 3</p>
 *     </div>
 *   </div>
 * );
 * ```
 */
export function useScrollToBottomOnHeightChange() {
  const scrollRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollRootElement = scrollRootRef.current;
    const scrollContentElement = scrollRootElement?.firstElementChild;

    if (!scrollRootElement || !(scrollContentElement instanceof HTMLElement)) return;

    function scrollToBottom() {
      scrollRootElement!.scrollTo({ top: scrollRootElement!.scrollHeight, behavior: 'smooth' });
    }

    const observer = new ResizeObserver(scrollToBottom);
    observer.observe(scrollContentElement);

    return () => observer.disconnect();
  }, []);

  return { scrollRootRef };
}

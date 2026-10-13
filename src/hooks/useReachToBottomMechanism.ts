import { useCallback, useEffect } from 'react';

const DEFAULT_GAP_TO_BOTTOM_PX = 100;
const DEFAULT_GAP_TO_BOTTOM_PERCENT = 4;

type UseReachToBottomMechanismProps = {
  onBottomReached?: () => void;
  /**
   * Needed for the on-mount first check.
   * The newly created handleBottomReached function will be invoked with the parentRef.current element as the argument.
   */
  parentRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Absolute distance in pixels from the bottom to trigger the callback.
   * Defaults to 100px.
   */
  thresholdInPx?: number;
  /**
   * Percentage of viewport height from the bottom to trigger the callback.
   * Defaults to 4%.
   */
  thresholdInPercent?: number;
  /**
   * @default true
   */
  shouldTriggerOnMount?: boolean;
};

/**
 * @description
 *
 * ## 1. Sketch of the scenario
 *
 * You have a container and a window.
 * h1 = represents the height of the container.
 * h2 = represents the height of the window.
 *
 * ```
 *               __________  h1_ceiling
 *              |          |             }
 *              |          |             }
 *              |          |             }
 *  h2_ceiling _|__________|_            } h1
 *            |              |  }        }
 *            |              |  } h2     }
 *   h2_floor |______________|  }        }
 *              |          |             }
 *              |          |             }
 *              |__________| h1_floor    }
 *
 * ```
 * h2_ceiling - h1_ceiling = the distance between the container's ceiling and the window's ceiling.
 * h1_floor - h2_floor = the distance between the container's floor and the window's floor.
 *
 * ---
 *
 * ## 2. JavaScript Terminology:
 *
 * - h1_ceiling = 0 (always): represents the y position of the container's ceiling.
 * - element.scrollTop: represents the always changing y position of the window's ceiling.
 * - element.clientHeight: represents the height of the small window (basically,  h2_floor - h2_ceiling).
 * - element.scrollHeight: represents the height of the big container (basically, h1_floor - h1_ceiling).
 *
 * ---
 *
 * ## 3. The formula:
 *
 * max_distance_to_travel: (element.scrollHeight - element.clientHeight)   <--- maximum distance that can be traveled in pixels.
 * distanceToTop = yPosOfSmallWindowCeiling - yPosOfBigContainerCeiling = scrollTop - 0 = scrollTop
 * distanceToBottom = h1_floor - h2_floor = scrollHeight - (small_window_ceiling + small_window_height) =  scrollHeight - ( scrollTop + clientHeight ) = scrollHeight - scrollTop - clientHeight
 * topPercentageGap = (distanceToTop / max_distance_to_travel) * 100;
 * bottomPercentageGap = (distanceToBottom / max_distance_to_travel) * 100;
 *
 * ---
 *
 * ## 4. How to use
 *
 * - Step 1: call the hook, and extract the handleTopReached/handleBottomReached function
 * - Step 2: attach it to the container element's `onScroll` attribute, like so:
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *
 *   const parentRef = useRef<HTMLDivElement>(null);
 *
 *   function onTopReached() {
 *     console.log('Top reached');
 *   }
 *
 *   const { handleTopReached } = useReachToTopMechanism({
 *     onTopReached,
 *     parentRef
 *   });
 *
 *   function handleScroll(e: React.UIEvent<HTMLDivElement>) {
 *     handleTopReached(e.target);
 *   }
 *
 *   return <div onScroll={handleScroll}>My Component</div>;
 * }
 * ```
 */
export function useReachToBottomMechanism(props: UseReachToBottomMechanismProps) {
  const {
    onBottomReached,
    parentRef,
    thresholdInPx = DEFAULT_GAP_TO_BOTTOM_PX,
    thresholdInPercent = DEFAULT_GAP_TO_BOTTOM_PERCENT,
    shouldTriggerOnMount = true,
  } = props;

  const handleBottomReached = useCallback(
    (containerRefElement: HTMLDivElement) => {
      if (containerRefElement && onBottomReached) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        const _100_percent = scrollHeight - clientHeight;
        const percentageGap = (distanceToBottom / _100_percent) * 100;

        const isCloseToBottom = distanceToBottom < thresholdInPx || percentageGap < thresholdInPercent;

        if (isCloseToBottom) onBottomReached();
      }
    },
    [onBottomReached, thresholdInPx, thresholdInPercent],
  );

  // A check on mount:
  useEffect(() => {
    if (!shouldTriggerOnMount) return;

    handleBottomReached(parentRef.current!);
  }, [handleBottomReached, parentRef, shouldTriggerOnMount]);

  return { handleBottomReached };
}

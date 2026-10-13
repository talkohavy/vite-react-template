import { useMemo, useState } from 'react';
import { wrapInDebounce } from '@talkohavy/lodash';
import { calcGapBetweenWindowCeilingAndContainerCeiling } from './utils/calcGapBetweenWindowCeilingAndContainerCeiling';
import { calcGapBetweenWindowFloorAndBottom } from './utils/calcGapBetweenWindowFloorAndBottom';

type UseIsCloseToEdgeProps = {
  to: 'top' | 'bottom';
  /**
   * Should be memoized.
   *
   * Called when the edge is reached.
   *
   * @param e - The event object.
   * @param isCloseToEdge - Whether the edge is close to the edge.
   */
  onEdgeReached?: (e: React.UIEvent<HTMLDivElement>, isCloseToEdge: boolean) => void;
  /**
   * The initial state of isCloseToEdge.
   *
   * @default false
   */
  initialIsCloseToEdge?: boolean;
  /**
   * Absolute distance in pixels from the edge to trigger the state change.
   *
   * @default 100
   */
  thresholdInPx?: number;
  /**
   * Percentage of viewport height from the edge to trigger the state change.
   * Defaults to 4%.
   *
   * @default 4
   */
  thresholdInPercent?: number;
  delayMs?: number;
};

/**
 * @description
 * `useIsCloseToEdge` serves a different purpose than `useReachToBottomMechanism` and `useReachToTopMechanism`.
 *
 * `useReachToBottomMechanism` and `useReachToTopMechanism` will tell you when you're within a certain threshold
 * from the edge, but they will never tell you when you're coming out of that threshold.
 *
 * Plus, they will trigger multiple times when you're scrolling within that threshold.
 *
 * `useIsCloseToEdge` will tell you when you're within a certain threshold from the edge,
 * and when you're coming out of that threshold. It will only trigger once when you've changed
 * states, and not multiple times when you're scrolling within that threshold.
 *
 */
export function useIsCloseToEdge(props: UseIsCloseToEdgeProps) {
  const {
    to = 'bottom',
    initialIsCloseToEdge = false,
    thresholdInPx = 100,
    thresholdInPercent = 4,
    delayMs = 100,
    onEdgeReached,
  } = props ?? {};

  const [isCloseToEdge, setIsCloseToEdge] = useState(initialIsCloseToEdge);

  // The debounce timer lives inside the returned function, so it must keep its identity between renders.
  const onScroll = useMemo(
    () =>
      wrapInDebounce((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollHeight, scrollTop, clientHeight } = e.target as HTMLDivElement;
        const calcGapFunc =
          to === 'top' ? calcGapBetweenWindowCeilingAndContainerCeiling : calcGapBetweenWindowFloorAndBottom;

        const distanceFromEdgeInPixels = calcGapFunc({ clientHeight, scrollHeight, scrollTop });

        const _100_percent = scrollHeight - clientHeight;
        const percentageGap = (distanceFromEdgeInPixels / _100_percent) * 100;

        const isWithinThreshold = distanceFromEdgeInPixels < thresholdInPx || percentageGap < thresholdInPercent;

        if (isWithinThreshold && !isCloseToEdge) {
          setIsCloseToEdge(true);
          onEdgeReached?.(e, isCloseToEdge);
          return;
        }

        if (!isWithinThreshold && isCloseToEdge) {
          setIsCloseToEdge(false);
          onEdgeReached?.(e, isCloseToEdge);
          return;
        }
      }, delayMs),
    [isCloseToEdge, onEdgeReached, thresholdInPx, thresholdInPercent, to, delayMs],
  );

  return { isCloseToEdge, onScroll };
}

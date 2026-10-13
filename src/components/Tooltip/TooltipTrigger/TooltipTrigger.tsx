import type { PropsWithChildren } from 'react';
import type { PlacementValues, VariantValues } from '../logic/constants';

type TooltipTriggerProps = PropsWithChildren<{
  groupId?: string;
  /**
   * Content to be displayed in the tooltip.
   */
  offsetOverride?: number;
  contentOverride?: string;
  placeOverride?: PlacementValues;
  delayShowOverride?: number;
  delayHideOverride?: number;
  variant?: VariantValues;
  /**
   * @default false
   */
  shouldFollowMouse?: boolean;
  /**
   * @default false
   */
  hide?: boolean;
  onClick?: (value: any) => void;
  onMouseEnter?: (value: any) => void;
  onMouseLeave?: (value: any) => void;
  className?: string;
}>;

export default function TooltipTrigger(props: TooltipTriggerProps) {
  const {
    groupId,
    children,
    offsetOverride,
    contentOverride,
    placeOverride,
    delayShowOverride,
    delayHideOverride,
    shouldFollowMouse,
    variant,
    hide,
    className,
    onClick,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const tooltipDataProps: any = {};

  if (groupId) tooltipDataProps['data-tooltip-id'] = groupId;
  if (offsetOverride) tooltipDataProps['data-tooltip-offset'] = offsetOverride;
  if (contentOverride) tooltipDataProps['data-tooltip-content'] = contentOverride;
  if (placeOverride) tooltipDataProps['data-tooltip-place'] = placeOverride;
  if (shouldFollowMouse) tooltipDataProps['data-tooltip-float'] = shouldFollowMouse;
  if (delayShowOverride) tooltipDataProps['data-tooltip-delay-show'] = delayShowOverride;
  if (delayHideOverride) tooltipDataProps['data-tooltip-delay-hide'] = delayHideOverride;
  if (hide) tooltipDataProps['data-tooltip-hidden'] = hide;
  if (variant) tooltipDataProps['data-tooltip-variant'] = variant;

  // tooltipDataProps['data-tooltip-class-name'] = 'custom-classname';

  return (
    <a
      {...tooltipDataProps}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
    >
      {children}
    </a>
  );
}

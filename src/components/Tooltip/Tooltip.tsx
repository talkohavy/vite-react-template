import type { PropsWithChildren, ReactNode } from 'react';
import { Tooltip as TooltipOriginal } from 'react-tooltip';
import { Placement, type PlacementValues, type VariantValues } from './logic/constants';
import styles from './Tooltip.module.scss';

type TooltipProps = PropsWithChildren<{
  groupId?: string;
  /**
   * Position relative to the anchor element where the tooltip will be rendered (if possible)
   * @default 'top'
   */
  place?: PlacementValues;
  /**
   * Set to `true` if you have content which is clickable.
   * This only works if you do NOT set your own isOpen/setIsOpen logic.
   *
   * **TIP**
   *
   * It is probably gonna look & feel better if you'd leave `shouldFollowMouse`
   * as _false_, when setting `isClickable` to _true_.
   * @default false
   */
  isClickable?: boolean;
  /**
   * @default 10
   */
  offset?: number;
  delayShow?: number;
  delayHide?: number;
  /**
   * @default undefined
   */
  isOpen?: boolean;
  /**
   * @default false
   */
  shouldFollowMouse?: boolean;
  /**
   * @default false
   */
  shouldOpenOnClick?: boolean;
  /**
   * @default false
   */
  hide?: boolean;
  /**
   * @default false
   */
  noArrow?: boolean;
  variant?: VariantValues;
  render?: (render: { content: ReactNode | null; activeAnchor: Element | null }) => ReactNode;
  className?: string;
  /**
   * You can add these:
   * style={{
   *   '--rt-color-white': '#fff',
   *   '--rt-color-dark': '#222',
   *   '--rt-color-success': '#8dc572',
   *   '--rt-color-error': '#be6464',
   *   '--rt-color-warning': '#f0ad4e',
   *   '--rt-color-info': '#337ab7',
   *   '--rt-opacity': '1',
   *   '--rt-transition-show-delay': '0.15s',
   *   '--rt-transition-closing-delay': '0.15s',
   * }}
   */
  style?: any;
}>;

export default function Tooltip(props: TooltipProps) {
  const {
    groupId,
    isOpen,
    place = Placement.Top,
    isClickable,
    offset,
    delayShow,
    delayHide,
    shouldFollowMouse,
    shouldOpenOnClick,
    hide,
    noArrow,
    children,
    render,
    variant,
    className,
    style,
  } = props;

  return (
    <div className={styles.tooltip}>
      <TooltipOriginal
        id={groupId}
        isOpen={isOpen}
        place={place}
        clickable={isClickable}
        offset={offset}
        delayShow={delayShow}
        delayHide={delayHide}
        float={shouldFollowMouse}
        openOnClick={shouldOpenOnClick}
        hidden={hide}
        noArrow={noArrow}
        render={render}
        variant={variant}
        className={className}
        style={style}
        // anchorSelect={`.${tooltipClassName}`}
        // content='placeholder...' // <--- DO NOT USE THIS! It takes precedence over `children`.
        // setIsOpen={setIsOpen}
        // afterShow={() => {}}
        // afterHide={() => {}}
        // border='1px solid red'
        // opacity={0.9} // <--- defaults to 0.9
        // arrowColor='blue'
        // positionStrategy='fixed' // <--- defaults to 'absolute'. Set to 'fixed' if you run into issues with overflow: hidden on the tooltip parent container.
      >
        {children ?? 'Empty tooltip...'}
      </TooltipOriginal>
    </div>
  );
}

/*
:root {
  --rt-color-white: #fff;
  --rt-color-dark: #222;
  --rt-color-success: #8dc572;
  --rt-color-error: #be6464;
  --rt-color-warning: #f0ad4e;
  --rt-color-info: #337ab7;
  --rt-opacity: 0.9;
  --rt-transition-show-delay: 0.15s;
  --rt-transition-closing-delay: 0.15s;
}
*/

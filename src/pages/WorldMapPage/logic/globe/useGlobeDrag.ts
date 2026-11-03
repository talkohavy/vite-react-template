import { useRef, useState, type PointerEvent } from 'react';
import { getRotationAfterDrag, type GlobeRotation } from './getRotationAfterDrag';

const UNROTATED: GlobeRotation = [0, 0];

/**
 * A pointer that moves less than this, in screen pixels, between press and release still counts as a click.
 */
const CLICK_TOLERANCE_PX = 3;

type DragStart = {
  clientX: number;
  clientY: number;
  rotation: GlobeRotation;
};

type UseGlobeDragProps = {
  isEnabled: boolean;
  /**
   * The SVG's viewBox width, to turn screen pixels into map units.
   */
  mapWidth: number;
  /**
   * The globe's radius on screen, in map units.
   */
  radius: number;
};

export function useGlobeDrag(props: UseGlobeDragProps) {
  const { isEnabled, mapWidth, radius } = props;

  const [rotation, setRotation] = useState<GlobeRotation>(UNROTATED);
  const dragStartRef = useRef<DragStart>(null);
  const hasDraggedRef = useRef(false);

  const isRotated = rotation[0] !== 0 || rotation[1] !== 0;

  function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
    hasDraggedRef.current = false;

    if (!isEnabled || event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = { clientX: event.clientX, clientY: event.clientY, rotation };
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    const dragStart = dragStartRef.current;

    if (!dragStart) return;

    const deltaXInPixels = event.clientX - dragStart.clientX;
    const deltaYInPixels = event.clientY - dragStart.clientY;

    if (Math.hypot(deltaXInPixels, deltaYInPixels) > CLICK_TOLERANCE_PX) hasDraggedRef.current = true;

    const unitsPerPixel = mapWidth / event.currentTarget.getBoundingClientRect().width;
    const nextRotation = getRotationAfterDrag({
      rotation: dragStart.rotation,
      deltaX: deltaXInPixels * unitsPerPixel,
      deltaY: deltaYInPixels * unitsPerPixel,
      radius,
    });

    setRotation(nextRotation);
  }

  function handlePointerUp() {
    dragStartRef.current = null;
  }

  function resetRotation() {
    setRotation(UNROTATED);
  }

  /**
   * Whether the last press turned into a drag, so the click that ends it shouldn't select anything.
   */
  function wasDragged() {
    return hasDraggedRef.current;
  }

  const dragHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
  };

  return { rotation, isRotated, resetRotation, wasDragged, dragHandlers };
}

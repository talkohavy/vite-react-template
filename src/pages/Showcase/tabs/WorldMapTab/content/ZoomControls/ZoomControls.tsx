import Button from '@src/components/controls/Button';

type ZoomControlsProps = {
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  isZoomedIn: boolean;
  canZoomIn: boolean;
};

export default function ZoomControls(props: ZoomControlsProps) {
  const { zoomLevel, zoomIn, zoomOut, resetZoom, isZoomedIn, canZoomIn } = props;

  return (
    <div className='flex flex-wrap items-center gap-3 text-sm'>
      <Button onClick={zoomIn} disabled={!canZoomIn} className='w-10'>
        +
      </Button>
      <Button onClick={zoomOut} disabled={!isZoomedIn} className='w-10'>
        −
      </Button>
      <Button onClick={resetZoom} disabled={!isZoomedIn}>
        Reset
      </Button>

      <span className='tabular-nums'>{zoomLevel.toFixed(1)}x</span>
      <span className='opacity-70'>Drag to pan · Ctrl/⌘ + scroll or pinch to zoom · double-click to zoom in</span>
    </div>
  );
}

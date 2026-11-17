import "maplibre-gl/dist/maplibre-gl.css";
import Button from "@src/components/controls/Button";
import RadioTabs from "@src/components/controls/RadioButtons/RadioTabs";
import {
  MAP_STYLES,
  MAX_VECTOR_TILE_LEVEL,
  VECTOR_PLACES,
  type MapStyleName,
} from "../logic/constants";
import { useDirections } from "../logic/directions/useDirections";
import { getVectorTileLevel } from "../logic/getVectorTileLevel";
import { useMapLibreMap } from "../logic/useMapLibreMap";
import DirectionsPanel from "./DirectionsPanel";
import type { RadioOption } from "@src/components/controls/RadioButtons";

const STYLE_OPTIONS: Array<RadioOption> = (
  Object.keys(MAP_STYLES) as Array<MapStyleName>
).map((styleName) => ({
  value: styleName,
  label: MAP_STYLES[styleName].label,
}));

const PROJECTION_OPTIONS: Array<RadioOption> = [
  { value: "mercator", label: "Flat map" },
  { value: "globe", label: "Globe" },
];

const ZOOM_FORMAT = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export default function VectorTileMap() {
  const {
    containerRef,
    mapRef,
    styleName,
    changeStyle,
    projection,
    changeProjection,
    zoom,
    flyToPlace,
    resetView,
  } = useMapLibreMap();
  const directions = useDirections(mapRef);

  const tileLevel = getVectorTileLevel(zoom);
  const isOverzoomed = zoom >= MAX_VECTOR_TILE_LEVEL + 1;

  return (
    <>
      <RadioTabs
        value={projection}
        setValue={changeProjection}
        options={PROJECTION_OPTIONS}
        className="flex flex-wrap gap-px w-full"
      />

      <RadioTabs
        value={styleName}
        setValue={changeStyle}
        options={STYLE_OPTIONS}
        className="flex flex-wrap gap-px"
      />

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Button onClick={resetView}>Reset</Button>
        <span>Jump to:</span>
        {VECTOR_PLACES.map((place) => (
          <Button key={place.name} onClick={() => flyToPlace(place)}>
            {place.name}
          </Button>
        ))}
      </div>

      <div className="text-sm tabular-nums">
        Zoom <strong>{ZOOM_FORMAT.format(zoom)}</strong> · Vector tile level{" "}
        <strong>{tileLevel}</strong> of {MAX_VECTOR_TILE_LEVEL}
        {isOverzoomed && (
          <> · redrawn from level {MAX_VECTOR_TILE_LEVEL}, still sharp</>
        )}
      </div>

      <div className="relative w-full">
        <div
          ref={containerRef}
          role="region"
          aria-label="Vector tile map drawn by MapLibre"
          className="h-196 w-full border border-gray-300 dark:border-gray-600"
        />

        <DirectionsPanel {...directions} />
      </div>
    </>
  );
}

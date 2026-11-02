import { feature } from 'topojson-client';
import landTopology from 'world-atlas/land-110m.json';
import type { GeometryCollection, Topology } from 'topojson-specification';

type LandObjects = {
  land: GeometryCollection;
};

const topology = landTopology as unknown as Topology<LandObjects>;

const landCollection = feature(topology, topology.objects.land);

/**
 * Every landmass on Earth merged into a single MultiPolygon feature (Natural Earth, 1:110m).
 */
export const WORLD_LAND = landCollection.features[0]!;

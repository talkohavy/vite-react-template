const DISTANCE_FORMAT = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 });

type FormatDistanceProps = { meters: number };

export function formatDistance(props: FormatDistanceProps) {
  const { meters } = props;

  const formattedDistance =
    meters >= 1000 ? `${DISTANCE_FORMAT.format(meters / 1000)} km` : `${DISTANCE_FORMAT.format(meters)} m`;

  return formattedDistance;
}

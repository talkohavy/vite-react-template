type GetCountryNameFromTargetProps = {
  target: EventTarget | null;
};

/**
 * Reads the `data-name` that every country `<path>` carries. Anything else (ocean, graticule, empty space) gives `null`.
 */
export function getCountryNameFromTarget(props: GetCountryNameFromTargetProps) {
  const { target } = props;

  if (!(target instanceof SVGElement)) return null;

  const countryName = target.dataset.name ?? null;

  return countryName;
}

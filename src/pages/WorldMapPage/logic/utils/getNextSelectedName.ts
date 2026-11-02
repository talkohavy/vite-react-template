type GetNextSelectedNameProps = {
  selectedName: string | null;
  clickedName: string | null;
};

/**
 * Clicking a country selects it, clicking it again clears it, and clicking outside any country clears it too.
 */
export function getNextSelectedName(props: GetNextSelectedNameProps) {
  const { selectedName, clickedName } = props;

  if (clickedName === selectedName) return null;

  return clickedName;
}

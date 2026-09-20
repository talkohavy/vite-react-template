export function getWrappedIndex(props: { delta: number; index: number; length: number }) {
  const { delta, index, length } = props;
  const nextIndex = (index + delta + length) % length;

  return nextIndex;
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
const billionsFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

/**
 * Formats a population given in millions, e.g. `1410.7` becomes "1.41 billion".
 */
export function formatPopulation(props: { millions: number }): string {
  const { millions } = props;

  if (millions >= 1000) {
    const billions = billionsFormatter.format(millions / 1000);

    return `${billions} billion`;
  }

  if (millions >= 1) {
    const formattedMillions = numberFormatter.format(millions);

    return `${formattedMillions} million`;
  }

  const thousands = numberFormatter.format(millions * 1000);

  return `${thousands} thousand`;
}

const KILOMETER_FORMAT = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

export function formatDistance(meters: number) {
  if (meters < 1000) return `${Math.round(meters / 10) * 10} m`;

  const kilometers = KILOMETER_FORMAT.format(meters / 1000);

  return `${kilometers} km`;
}

export function formatDuration(seconds: number) {
  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;

  if (minutes === 0) return `${hours} h`;

  return `${hours} h ${minutes} min`;
}

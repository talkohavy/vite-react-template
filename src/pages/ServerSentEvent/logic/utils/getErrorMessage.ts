export function getErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Something went wrong';

  return message;
}

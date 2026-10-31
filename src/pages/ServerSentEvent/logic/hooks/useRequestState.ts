import { useState } from 'react';
import { getErrorMessage } from '../utils/getErrorMessage';

export function useRequestState() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Runs the request, tracking whether it's pending and the error it failed with. Never throws.
   */
  async function run(request: () => Promise<void>): Promise<void> {
    setIsPending(true);
    setError(null);

    try {
      await request();
    } catch (err) {
      const message = getErrorMessage(err);

      setError(message);
    } finally {
      setIsPending(false);
    }
  }

  return { isPending, error, run };
}

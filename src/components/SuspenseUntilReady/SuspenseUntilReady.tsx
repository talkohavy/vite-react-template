import { Suspense, use, type PropsWithChildren, type ReactNode } from 'react';

type SuspenseUntilReadyProps = PropsWithChildren<{
  /**
   * Must be created outside of render (e.g. at module scope), otherwise a new promise is created on every render.
   */
  promise: Promise<void>;
  Loader?: ReactNode | (() => ReactNode);
}>;

export default function SuspenseUntilReady(props: SuspenseUntilReadyProps) {
  const { children, promise, Loader } = props;

  const fallback = typeof Loader === 'function' ? <Loader /> : (Loader ?? null);

  return (
    <Suspense fallback={fallback}>
      <WaitForPromise promise={promise}>{children}</WaitForPromise>
    </Suspense>
  );
}

type WaitForPromiseProps = PropsWithChildren<{ promise: Promise<void> }>;

function WaitForPromise(props: WaitForPromiseProps) {
  const { promise, children } = props;

  use(promise);

  return children;
}

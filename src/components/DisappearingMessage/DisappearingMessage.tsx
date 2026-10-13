import { useEffect, useState, type PropsWithChildren } from 'react';
import clsx from 'clsx';

type DisappearingMessageProps = PropsWithChildren<{
  /**
   * When value is `null`, the children of this component are invisible.
   *
   * `value` **MUST** be a primitive value, since it is being compared v.s. its previous state.
   */
  value: number | string | boolean | null;
  className?: string;
}>;

export default function DisappearingMessage(props: DisappearingMessageProps) {
  const { value, children, className } = props;

  const [isVisible, setIsVisible] = useState(value !== null);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setIsVisible(value !== null);
  }

  useEffect(() => {
    if (value === null) return;

    const timer = setTimeout(() => setIsVisible(false), 3000);

    return () => clearTimeout(timer);
  }, [value]);

  return <div className={clsx('h-10 w-full shrink-0', className)}>{isVisible && children}</div>;
}

import { useEffect, useEffectEvent } from 'react';

type UseEventListenerProps = {
  eventType: string;
  fnToRun: (props?: any) => void;
  dependencies?: Array<any>;
  element?: any;
  /**
   * @default true
   */
  shouldExecute?: boolean;
};

export default function useEventListener(props: UseEventListenerProps) {
  const { eventType, fnToRun, dependencies = [], element = window, shouldExecute = true } = props;

  const onEvent = useEffectEvent((event?: Event) => fnToRun(event));

  useEffect(() => {
    if (!shouldExecute) return;

    function handleEvent(event: Event) {
      onEvent(event);
    }

    element.addEventListener(eventType, handleEvent);

    onEvent();

    return () => element.removeEventListener(eventType, handleEvent);
    // element should no be a dependency, it should not change between renders.
    // eslint-disable-next-line
  }, [...dependencies, eventType, shouldExecute]);
}

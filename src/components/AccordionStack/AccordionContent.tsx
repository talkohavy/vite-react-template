import type { PropsWithChildren } from 'react';
import { Content } from '@radix-ui/react-accordion';
import clsx from 'clsx';

type AccordionContentProps = PropsWithChildren<{
  ref?: React.RefObject<HTMLDivElement>;
  className?: string;
}>;

export default function AccordionContent(props: AccordionContentProps) {
  const { ref, children, className, ...restProps } = props;

  return (
    <Content className={clsx('overflow-hidden bg-slate-50 text-slate-700', className)} {...restProps} ref={ref}>
      {children}
    </Content>
  );
}

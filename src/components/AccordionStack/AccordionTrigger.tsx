import type { PropsWithChildren } from 'react';
import { Header, Trigger } from '@radix-ui/react-accordion';
import clsx from 'clsx';
import DownArrow from '../svgs/DownArrow';

type AccordionTriggerProps = PropsWithChildren<{
  ref?: React.Ref<HTMLButtonElement>;
  className?: string;
}>;

export default function AccordionTrigger(props: AccordionTriggerProps) {
  const { ref, children, className, ...restProps } = props;

  return (
    <Header className='flex'>
      <Trigger
        className={clsx(
          'group flex h-11 flex-1 items-center justify-between bg-white px-5 text-purple-500 shadow-sm hover:bg-slate-50',
          className,
        )}
        {...restProps}
        ref={ref}
      >
        {children}

        <DownArrow aria-hidden className='transition-all duration-300 group-data-[state=open]:rotate-180' />
      </Trigger>
    </Header>
  );
}

import { Item, Root } from '@radix-ui/react-accordion';
import AccordionContent from './AccordionContent';
import AccordionTrigger from './AccordionTrigger';

type AccordionStackProps = {
  ref?: React.RefObject<HTMLDivElement>;
  data: Array<{
    value: string;
    triggerElement: string | import('react').ReactNode;
    contentElement: string | import('react').ReactNode;
    contentClassName?: string;
  }>;
  globalContentClassName?: string;
};

export default function AccordionStack(props: AccordionStackProps) {
  const { data = [], globalContentClassName } = props;

  return (
    <Root className='w-80 rounded-md bg-slate-100 shadow-sm' type='single' defaultValue='item-1' collapsible>
      {data.map(({ value, triggerElement, contentElement, contentClassName }) => (
        <Item
          key={value}
          value={value}
          className='mt-px overflow-hidden first:mt-0 first:rounded-t-sm last:rounded-b-sm focus-within:relative focus-within:z-10 focus-within:shadow-xs'
        >
          <AccordionTrigger>{triggerElement}</AccordionTrigger>
          <AccordionContent className={contentClassName ?? globalContentClassName}>{contentElement}</AccordionContent>
        </Item>
      ))}
    </Root>
  );
}

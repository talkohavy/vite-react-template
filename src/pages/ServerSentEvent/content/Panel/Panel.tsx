import type { PropsWithChildren, ReactNode } from 'react';

type PanelProps = PropsWithChildren<{
  title: string;
  description?: ReactNode;
  /**
   * Shown at the end of the title row, e.g. a button.
   */
  actions?: ReactNode;
}>;

export default function Panel(props: PanelProps) {
  const { title, description, actions, children } = props;

  return (
    <section className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
      <div className='flex flex-col gap-1'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>{title}</h2>

          {actions}
        </div>

        {description && <p className='text-sm text-gray-500 dark:text-gray-400'>{description}</p>}
      </div>

      {children}
    </section>
  );
}

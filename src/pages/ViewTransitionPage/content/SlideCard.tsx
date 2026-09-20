import clsx from 'clsx';
import type { Slide } from '../logic/constants';

export default function SlideCard(props: { className?: string; slide: Slide }) {
  const { className, slide } = props;

  return (
    <div
      className={clsx(
        'flex min-h-40 w-full flex-col justify-end rounded-2xl bg-linear-to-br p-5 text-white shadow-md',
        slide.accentClassName,
        className,
      )}
    >
      <h3 className='text-xl font-semibold'>{slide.title}</h3>
      <p className='text-sm text-white/85'>{slide.description}</p>
    </div>
  );
}

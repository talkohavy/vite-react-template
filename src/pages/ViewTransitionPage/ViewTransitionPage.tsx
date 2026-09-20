import { addTransitionType, startTransition, useState, ViewTransition } from 'react';
import Button from '../../components/controls/Button';
import SlideCard from './content/SlideCard';
import { FIRST_SLIDE, SHARED_ELEMENT_NAME, SLIDES } from './logic/constants';
import './view-transition.css';
import { getWrappedIndex } from './logic/utils/getWrappedIndex';

/**
 * Demo: React 19.3 `<ViewTransition>`.
 *
 * Animations only run for updates marked as a Transition (`startTransition`),
 * a Suspense reveal, or `useDeferredValue`. Plain `setState` is treated as urgent
 * and skips the animation. See https://react.dev/reference/react/ViewTransition
 */
export default function ViewTransitionPage() {
  const [isShowing, setIsShowing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedSlide = SLIDES[selectedIndex];

  function toggleCard() {
    startTransition(() => {
      setIsShowing((previous) => !previous);
    });
  }

  function goToPrevious() {
    startTransition(() => {
      addTransitionType('previous');
      setSelectedIndex((index) => getWrappedIndex({ index, length: SLIDES.length, delta: -1 }));
    });
  }

  function goToNext() {
    startTransition(() => {
      addTransitionType('next');
      setSelectedIndex((index) => getWrappedIndex({ index, length: SLIDES.length, delta: 1 }));
    });
  }

  function expandCard() {
    startTransition(() => {
      setIsExpanded(true);
    });
  }

  function collapseCard() {
    startTransition(() => {
      setIsExpanded(false);
    });
  }

  return (
    <div className='flex size-full flex-col gap-8 overflow-auto p-6'>
      <header className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          React 19.3 <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;ViewTransition&gt;</code>
        </h1>

        <p className='max-w-3xl text-sm text-gray-600 dark:text-gray-400'>
          Wrap UI in <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;ViewTransition&gt;</code> and put
          the state update inside <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>startTransition</code>.
          React then animates enter, exit, update, or a shared-element morph using the browser View Transition API.
          Docs:{' '}
          <a
            href='https://react.dev/blog/2026/09/09/react-19-3'
            target='_blank'
            rel='noreferrer'
            className='text-blue-600 underline dark:text-blue-400'
          >
            React 19.3 blog
          </a>
          {' · '}
          <a
            href='https://react.dev/reference/react/ViewTransition'
            target='_blank'
            rel='noreferrer'
            className='text-blue-600 underline dark:text-blue-400'
          >
            ViewTransition reference
          </a>
        </p>
      </header>

      <section className='flex flex-col gap-3'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>1. Enter / exit</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Default cross-fade. The <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>ViewTransition</code> must
          be the first node in the subtree being added or removed.
        </p>

        <Button onClick={toggleCard} className='w-fit'>
          {isShowing ? 'Hide card' : 'Show card'}
        </Button>

        <div className='min-h-40 max-w-md'>
          {isShowing && (
            <ViewTransition>
              <SlideCard slide={FIRST_SLIDE} />
            </ViewTransition>
          )}
        </div>
      </section>

      <section className='flex max-w-md flex-col gap-3'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>2. Directional carousel</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Call <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>addTransitionType</code> next to the state
          update so the same slide change can animate left or right.
        </p>

        <div className='flex gap-2'>
          <Button onClick={goToPrevious} className='w-fit'>
            Previous
          </Button>
          <Button onClick={goToNext} className='w-fit'>
            Next
          </Button>
        </div>

        <ViewTransition name='carousel-frame' default='none' update='none'>
          <div className='carousel-frame overflow-clip rounded-2xl'>
            {selectedSlide && (
              <ViewTransition
                key={selectedSlide.id}
                enter={{ next: 'from-right', previous: 'from-left', default: 'auto' }}
                exit={{ next: 'to-left', previous: 'to-right', default: 'auto' }}
              >
                <SlideCard slide={selectedSlide} />
              </ViewTransition>
            )}
          </div>
        </ViewTransition>
      </section>

      <section className='flex max-w-md flex-col gap-3'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>3. Shared element</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          The same <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>name</code> on an unmounting tree and a
          mounting tree morphs one snapshot into the other.
        </p>

        {isExpanded ? (
          <ViewTransition name={SHARED_ELEMENT_NAME}>
            <div className='flex flex-col gap-3'>
              <SlideCard slide={FIRST_SLIDE} className='min-h-64' />
              <Button onClick={collapseCard} className='w-fit'>
                Collapse
              </Button>
            </div>
          </ViewTransition>
        ) : (
          <ViewTransition name={SHARED_ELEMENT_NAME}>
            <button type='button' onClick={expandCard} className='w-40 text-left'>
              <SlideCard slide={FIRST_SLIDE} className='min-h-24' />
            </button>
          </ViewTransition>
        )}
      </section>
    </div>
  );
}

import { Suspense } from 'react';
import RadioTabs from '../../components/controls/RadioButtons/RadioTabs';
import DownArrow from '../../components/svgs/DownArrow';
import { tabs } from './logic/constants';
import { useShowcaseLogic } from './logic/useShowcaseLogic';

export default function Showcase() {
  const {
    TabContent,
    selectedTabIndex,
    setSelectedTabIndex,
    refElement,
    isCloseToBottom,
    isCloseToTop,
    onScrollToBottom,
    onScrollToTop,
    scrollToBottom,
    scrollToTop,
  } = useShowcaseLogic();

  return (
    <div
      ref={refElement as any}
      onScroll={(e) => {
        onScrollToBottom(e);
        onScrollToTop(e);
      }}
      className='flex flex-col gap-6 items-start size-full p-6 overflow-auto'
    >
      {!isCloseToBottom && (
        <button
          type='button'
          onClick={scrollToBottom}
          className='fixed top-20 z-10 right-10 flex justify-center items-center size-12 cursor-pointer bg-red-500 hover:bg-red-400 rounded-full border'
        >
          <DownArrow className='size-3' />
        </button>
      )}

      <RadioTabs
        value={selectedTabIndex}
        setValue={setSelectedTabIndex}
        options={tabs}
        className='flex flex-wrap gap-px overflow-auto shrink-0 w-full'
      />

      <div className='font-mono flex flex-col gap-10 items-start w-full min-h-0'>
        <Suspense fallback={<div>Loading...</div>}>
          <TabContent />
        </Suspense>
      </div>

      {!isCloseToTop && (
        <button
          type='button'
          onClick={scrollToTop}
          className='fixed bottom-10 right-10 flex justify-center items-center size-12 cursor-pointer bg-blue-500 hover:bg-blue-400 rounded-full border'
        >
          <DownArrow className='size-3 rotate-180' />
        </button>
      )}
    </div>
  );
}

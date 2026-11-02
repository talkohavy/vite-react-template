import { Outlet } from 'react-router';
import RadioTabs from '@src/components/controls/RadioButtons/RadioTabs';
import { tabOptions } from './logic/constants';
import { useWorldMapPageLogic } from './logic/useWorldMapPageLogic';

export default function WorldMapPage() {
  const { currentTabValue, handleTabChange } = useWorldMapPageLogic();

  return (
    <div className='size-full overflow-auto p-6'>
      <div className='flex flex-col gap-8'>
        <header>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>World Map</h1>

          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            A world map built up one step at a time. Each tab adds a single idea on top of the previous one.
          </p>
        </header>

        <div className='border-b border-gray-200 dark:border-gray-600'>
          <RadioTabs
            value={currentTabValue}
            setValue={handleTabChange}
            options={tabOptions}
            className='flex flex-wrap gap-px pb-4'
          />
        </div>

        <Outlet />
      </div>
    </div>
  );
}

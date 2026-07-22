import clsx from 'clsx';
import { LS_KEY_IS_SIDEBAR_OPEN } from '@src/common/constants';
import { useLocalStorage } from '@src/hooks/useLocalStorage';
import DownArrow from '../../svgs/DownArrow';
import SideBarLinkList from './SideBarLinkList';

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorage(LS_KEY_IS_SIDEBAR_OPEN, false);

  return (
    <nav
      className={clsx(
        'relative flex h-full shrink-0 flex-col items-start justify-start bg-amber-50 shadow-md transition-all duration-300 dark:bg-slate-500',
        isSidebarOpen ? 'w-72' : 'w-10',
      )}
    >
      <div className='size-full p-4 overflow-auto'>
        <button
          type='button'
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className='absolute right-0 top-1/2 size-8 cursor-pointer translate-x-1/2 rounded-full bg-blue-400 p-2 opacity-20 hover:opacity-100'
        >
          <DownArrow className={clsx('stroke-black', isSidebarOpen ? 'rotate-90' : 'rotate-270')} />
        </button>

        <div
          className={clsx(
            'w-full opacity-0 transition-opacity duration-300 delay-300 overflow-auto',
            isSidebarOpen && 'opacity-100',
          )}
        >
          {isSidebarOpen && <SideBarLinkList />}
        </div>
      </div>
    </nav>
  );
}

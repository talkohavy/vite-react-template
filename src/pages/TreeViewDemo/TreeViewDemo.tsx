import { Outlet, useLocation, useNavigate } from 'react-router';
import { BASE_URL } from '@src/common/constants';
import { extractTabValueFromPathname } from '@src/common/utils/extractTabValueFromPathname';
import RadioTabs from '@src/components/controls/RadioButtons/RadioTabs';
import { pageName } from './logic/constants';

const pageSlug = 'tree-view-demo';

const Tabs = {
  StaticTree: '',
  DynamicTree: 'dynamic-tree',
  CustomRendering: 'custom-rendering',
  RefControl: 'ref-control',
  Playground: 'playground',
} as const;

const tabOptions = [
  {
    value: Tabs.StaticTree,
    label: 'Static Tree',
  },
  {
    value: Tabs.DynamicTree,
    label: 'Dynamic Tree',
  },
  {
    value: Tabs.CustomRendering,
    label: 'Custom Rendering',
  },
  {
    value: Tabs.RefControl,
    label: 'Ref Control',
  },
  {
    value: Tabs.Playground,
    label: 'Playground',
  },
];

export default function TreeViewDemo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentTabValue = extractTabValueFromPathname({ pageSlug, pathname });

  function handleTabChange(tabValue: string) {
    const targetPath = `${BASE_URL}/${pageName}/${tabValue}`;
    navigate(targetPath);
  }

  return (
    <div className='size-full flex flex-col gap-6 overflow-auto'>
      <div className='px-6 pt-6'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>TreeView Component Demo</h1>
          <p className='text-gray-600 dark:text-gray-400'>
            A flexible tree view component supporting both static and dynamic configurations
          </p>
        </div>

        {/* Tab Navigation */}
        <div className='border-b border-gray-200 dark:border-gray-600'>
          <RadioTabs
            value={currentTabValue}
            setValue={handleTabChange}
            options={tabOptions}
            className='flex space-x-1 mb-4'
          />
        </div>
      </div>

      <div className='size-full overflow-auto'>
        <Outlet />
      </div>
    </div>
  );
}

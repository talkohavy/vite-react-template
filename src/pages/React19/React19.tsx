import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { BASE_URL } from '@src/common/constants';
import { extractTabValueFromPathname } from '@src/common/utils/extractTabValueFromPathname';
import RadioTabs from '@src/components/controls/RadioButtons/RadioTabs';

const pageName = 'react-19'; // <--- has o match with the route path in routes.ts

const Tabs = {
  UseActionStateTab: '',
  UseFormStatus: 'use-form-status', // <--- has to match with the sub-route path in routes.ts
  UseOptimisticUpdate: 'use-optimistic-update', // <--- has to match with the sub-route path in routes.ts
  UseTab: 'use-tab', // <--- has to match with the sub-route path in routes.ts
  DocumentMetadata: 'document-metadata', // <--- has to match with the sub-route path in routes.ts
} as const;

const tabOptions = [
  {
    value: Tabs.UseActionStateTab,
    label: 'useActionState',
  },
  {
    value: Tabs.UseFormStatus,
    label: 'useFormStatus',
  },
  {
    value: Tabs.UseOptimisticUpdate,
    label: 'useOptimisticUpdate',
  },
  {
    value: Tabs.UseTab,
    label: 'useTab',
  },
  {
    value: Tabs.DocumentMetadata,
    label: 'DocumentMetadata',
  },
];

export default function React19() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTabValue, setCurrentTabValue] = useState(() => extractTabValueFromPathname(pageName));

  // Update currentTabValue when the URL changes (e.g., browser back/forward)
  useEffect(() => {
    const newTabValue = extractTabValueFromPathname(pageName);
    setCurrentTabValue(newTabValue);
  }, [location.pathname]);

  function handleTabChange(tabValue: string) {
    setCurrentTabValue(tabValue);

    const targetPath = `${BASE_URL}/${pageName}/${tabValue}`;
    navigate(targetPath);
  }

  return (
    <div className='size-full flex flex-col gap-6 overflow-auto font-thin'>
      <div className='px-6 pt-6'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>React 19 Demo</h1>

          <p className='text-gray-600 dark:text-gray-400'>
            Explore the React 19 demo, showcasing custom rendering, dynamic loading, and interactive selections.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className='border-b border-gray-200 dark:border-gray-600'>
          <RadioTabs value={currentTabValue} setValue={handleTabChange} options={tabOptions} className='flex mb-1' />
        </div>
      </div>

      <div className='size-full overflow-auto'>
        <Outlet />
      </div>
    </div>
  );
}

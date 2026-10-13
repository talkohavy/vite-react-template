import { Outlet, useLocation, useNavigate } from 'react-router';
import { BASE_URL } from '@src/common/constants';
import { extractTabValueFromPathname } from '@src/common/utils/extractTabValueFromPathname';
import RadioTabs from '@src/components/controls/RadioButtons/RadioTabs';

const pageSlug = 'progressive-web-app';

const Tabs = {
  Register: '',
  CacheAsset: 'cache-asset',
  CacheContent: 'cache-content',
  BackgroundSync: 'background-sync',
  FullExample: 'full-example',
} as const;

const tabOptions = [
  {
    value: Tabs.Register,
    label: 'Register',
  },
  {
    value: Tabs.CacheAsset,
    label: 'Cache Asset',
  },
  {
    value: Tabs.CacheContent,
    label: 'Cache Content',
  },
  {
    value: Tabs.BackgroundSync,
    label: 'Background Sync',
  },
  {
    value: Tabs.FullExample,
    label: 'Full Example',
  },
];

export default function ProgressiveWebAppPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentTabValue = extractTabValueFromPathname({ pageSlug, pathname });

  function handleTabChange(tabValue: string) {
    const targetPath = `${BASE_URL}/progressive-web-app/${tabValue}`;
    navigate(targetPath);
  }

  return (
    <div className='flex flex-col size-full p-4'>
      <RadioTabs
        value={currentTabValue}
        setValue={handleTabChange}
        options={tabOptions}
        className='flex shrink-0 overflow-auto'
      />

      <div className='size-full overflow-auto'>
        <Outlet />
      </div>
    </div>
  );
}

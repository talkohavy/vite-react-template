import { Outlet, useLocation, useNavigate } from 'react-router';
import { BASE_URL } from '@src/common/constants';
import { extractTabValueFromPathname } from '@src/common/utils/extractTabValueFromPathname';
import RadioTabs from '@src/components/controls/RadioButtons/RadioTabs';
import { pageName } from './logic/constants';

const pageSlug = 'query-language';

const Tabs = {
  Lexer: '',
  TokenStream: 'token-stream',
  QueryParser: 'query-parser',
  ContextAnalyzer: 'context-analyzer',
  Suggestions: 'suggestions',
  UIChips: 'ui-chips',
  QueryLanguage: 'query-language',
} as const;

const tabOptions = [
  {
    value: Tabs.Lexer,
    label: 'Lexer',
  },
  {
    value: Tabs.QueryParser,
    label: 'Query Parser',
  },
  {
    value: Tabs.Suggestions,
    label: 'Suggestions',
  },
  {
    value: Tabs.UIChips,
    label: 'UI Chips',
  },
  {
    value: Tabs.QueryLanguage,
    label: 'Query Language',
  },
];

export default function QueryPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentTabValue = extractTabValueFromPathname({ pageSlug, pathname });

  function handleTabChange(tabValue: string) {
    const targetPath = `${BASE_URL}/${pageName}/${tabValue}`;
    navigate(targetPath);
  }

  return (
    <div className='size-full flex flex-col gap-6 overflow-auto'>
      {/* Tab Navigation */}
      <div className='border-b border-gray-200 dark:border-gray-600 px-6 pt-6'>
        <RadioTabs
          value={currentTabValue}
          setValue={handleTabChange}
          options={tabOptions}
          className='flex space-x-1 mb-4'
        />
      </div>

      <div className='size-full overflow-auto'>
        <Outlet />
      </div>
    </div>
  );
}

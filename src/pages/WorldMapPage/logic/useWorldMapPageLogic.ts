import { useLocation, useNavigate } from 'react-router';
import { BASE_URL } from '@src/common/constants';
import { extractTabValueFromPathname } from '@src/common/utils/extractTabValueFromPathname';
import { pageSlug } from './constants';

export function useWorldMapPageLogic() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentTabValue = extractTabValueFromPathname({ pageSlug, pathname });

  function handleTabChange(tabValue: string) {
    const targetPath = `${BASE_URL}/${pageSlug}/${tabValue}`.replace(/\/+$/, '');
    navigate(targetPath);
  }

  return { currentTabValue, handleTabChange };
}

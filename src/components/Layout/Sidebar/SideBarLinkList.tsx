import { BASE_URL } from '@src/common/constants';
import { routes as routesRaw } from '@src/routes';
import SideBarLinkItem from './SideBarLinkItem';

const routes = routesRaw
  .filter((route) => !route.hideFromSidebar)
  .map(({ to, text }) => {
    const toWithBaseUrl = `${BASE_URL}/${to}`;

    return { to: toWithBaseUrl, text };
  });

export default function SideBarLinkList() {
  return (
    <div className='flex flex-col items-start justify-start text-sm font-thin'>
      {routes.map(({ to, text }) => (
        <SideBarLinkItem key={text} to={to} text={text} />
      ))}
    </div>
  );
}

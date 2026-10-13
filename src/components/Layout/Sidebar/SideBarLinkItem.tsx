import { NavLink } from 'react-router';
import clsx from 'clsx';

type SideBarLinkItemProps = {
  to: string;
  text?: string;
};

export default function SideBarLinkItem(props: SideBarLinkItemProps) {
  const { to, text } = props;

  return (
    <NavLink
      to={to}
      className={({ isActive }) => clsx('text-lg hover:text-red-500 active:text-red-400', isActive && 'font-medium')}
    >
      {text}
    </NavLink>
  );
}

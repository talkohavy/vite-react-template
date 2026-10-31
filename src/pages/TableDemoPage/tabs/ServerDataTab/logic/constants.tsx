import { createColumnHelper } from '@talkohavy/table';
import clsx from 'clsx';
import { formatDate } from './utils/formatDate';
import { formatDateTime } from './utils/formatDateTime';
import type { User } from '../types';

const columnHelper = createColumnHelper<User>();

export const columnDefs = [
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    size: 220,
    enableSorting: true,
  }),
  columnHelper.accessor('nickname', {
    header: 'Nickname',
    enableSorting: true,
  }),
  columnHelper.accessor('date_of_birth', {
    header: 'Date of Birth',
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor('is_active', {
    header: 'Status',
    cell: (info) => {
      const isActive = info.getValue();
      return (
        <span
          className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            isActive
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          )}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      );
    },
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    meta: { className: 'flex-1' },
    cell: (info) => formatDateTime(info.getValue()),
  }),
];

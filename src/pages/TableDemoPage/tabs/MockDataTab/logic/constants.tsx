import { createColumnHelper } from '@talkohavy/table';
import clsx from 'clsx';
import type { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    age: 28,
    department: 'Engineering',
    status: 'active',
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@example.com',
    age: 34,
    department: 'Marketing',
    status: 'active',
  },
  {
    id: 3,
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@example.com',
    age: 45,
    department: 'Sales',
    status: 'inactive',
  },
  {
    id: 4,
    firstName: 'Diana',
    lastName: 'Ross',
    email: 'diana.ross@example.com',
    age: 29,
    department: 'Engineering',
    status: 'active',
  },
  {
    id: 5,
    firstName: 'Edward',
    lastName: 'Wilson',
    email: 'edward.wilson@example.com',
    age: 52,
    department: 'HR',
    status: 'pending',
  },
  {
    id: 6,
    firstName: 'Fiona',
    lastName: 'Davis',
    email: 'fiona.davis@example.com',
    age: 31,
    department: 'Design',
    status: 'active',
  },
  {
    id: 7,
    firstName: 'George',
    lastName: 'Miller',
    email: 'george.miller@example.com',
    age: 38,
    department: 'Engineering',
    status: 'active',
  },
  {
    id: 8,
    firstName: 'Hannah',
    lastName: 'Taylor',
    email: 'hannah.taylor@example.com',
    age: 26,
    department: 'Marketing',
    status: 'inactive',
  },
  {
    id: 9,
    firstName: 'Ivan',
    lastName: 'Anderson',
    email: 'ivan.anderson@example.com',
    age: 41,
    department: 'Sales',
    status: 'active',
  },
  {
    id: 10,
    firstName: 'Julia',
    lastName: 'Thomas',
    email: 'julia.thomas@example.com',
    age: 33,
    department: 'Design',
    status: 'pending',
  },
  {
    id: 11,
    firstName: 'Kevin',
    lastName: 'Jackson',
    email: 'kevin.jackson@example.com',
    age: 47,
    department: 'HR',
    status: 'active',
  },
  {
    id: 12,
    firstName: 'Laura',
    lastName: 'White',
    email: 'laura.white@example.com',
    age: 30,
    department: 'Engineering',
    status: 'active',
  },
  {
    id: 13,
    firstName: 'Michael',
    lastName: 'Harris',
    email: 'michael.harris@example.com',
    age: 36,
    department: 'Marketing',
    status: 'inactive',
  },
  {
    id: 14,
    firstName: 'Nancy',
    lastName: 'Martin',
    email: 'nancy.martin@example.com',
    age: 42,
    department: 'Sales',
    status: 'active',
  },
  {
    id: 15,
    firstName: 'Oscar',
    lastName: 'Garcia',
    email: 'oscar.garcia@example.com',
    age: 27,
    department: 'Design',
    status: 'pending',
  },
];

const columnHelper = createColumnHelper<User>();

export const columnDefs = [
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor('firstName', {
    header: 'First Name',
    enableSorting: true,
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    enableSorting: true,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    size: 280,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    enableSorting: true,
    size: 100,
  }),
  columnHelper.accessor('department', {
    header: 'Department',
    enableSorting: true,
    size: 180,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue();
      const statusStyles = {
        active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      };
      return <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', statusStyles[status])}>{status}</span>;
    },
    meta: { className: 'flex-1' },
  }),
];

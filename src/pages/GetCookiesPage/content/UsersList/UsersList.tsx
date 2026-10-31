import type { User } from '../../logic/types';

type UsersListProps = {
  users: Array<User>;
  isLoading: boolean;
  error: any;
};

export default function UsersList(props: UsersListProps) {
  const { users, isLoading, error } = props;

  return (
    <div className='flex flex-col gap-4 w-full overflow-auto max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md dark:shadow-dark-md rounded-md p-6 border border-gray-200 dark:border-gray-700'>
      <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>Users</h2>

      {isLoading && <p className='text-sm text-gray-600 dark:text-gray-400'>Loading users...</p>}

      {error && !isLoading && (
        <div className='p-2 rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-sm'>
          <p>{error?.message || 'Failed to fetch users'}</p>
          {error?.status && <p className='font-mono'>Status Code: {error.status}</p>}
        </div>
      )}

      {!isLoading && !error && users.length === 0 && (
        <p className='text-sm text-gray-600 dark:text-gray-400'>No users found.</p>
      )}

      {!isLoading && !error && users.length > 0 && (
        <ul className='flex flex-col gap-2 divide-y divide-gray-200 dark:divide-gray-700'>
          {users.map((user) => (
            <li key={user.id} className='flex items-center justify-between gap-4 py-2'>
              <div className='min-w-0'>
                <p className='text-sm font-medium text-gray-800 dark:text-gray-100 truncate'>{user.nickname}</p>
                <p className='text-xs text-gray-600 dark:text-gray-400 truncate'>{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

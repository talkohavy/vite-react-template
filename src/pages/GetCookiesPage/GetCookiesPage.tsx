import clsx from 'clsx';
import Button from '@src/components/controls/Button/Button';
import Input from '@src/components/controls/Input/Input';
import UsersList from './content/UsersList';
import { useGetCookiesPageLogic } from './logic/useGetCookiesPageLogic';

export default function GetCookiesPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    setErrors,
    handleLogin,
    loginMessage,
    users,
    isLoading,
    isLoadingUsers,
    usersError,
  } = useGetCookiesPageLogic();

  return (
    <div className='flex justify-center size-full p-6 overflow-auto bg-white dark:bg-gray-900'>
      <div className='flex flex-col items-center justify-start size-full max-w-md gap-8'>
        <h1 className='text-2xl text-center w-full font-bold text-gray-800 dark:text-gray-100'>Login</h1>

        <div className='flex flex-col gap-4 w-full bg-white dark:bg-gray-800 shadow-md dark:shadow-dark-md rounded-md p-6 border border-gray-200 dark:border-gray-700'>
          <div className='flex flex-col gap-2'>
            <div className='block text-gray-700 dark:text-gray-200 text-sm font-bold'>Email</div>

            <Input
              type='text'
              onChange={(value) => {
                setEmail(value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              initialValue={email}
              placeholder='Enter your email'
              className='w-full'
              testId='email'
            />
            {errors.email && <p className='text-red-500 dark:text-red-400 text-xs'>{errors.email}</p>}
          </div>

          <div className='flex flex-col gap-2'>
            <div className='block text-gray-700 dark:text-gray-200 text-sm font-bold'>Password</div>

            <Input
              type='password'
              onChange={(value) => {
                setPassword(value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              initialValue={password}
              placeholder='Enter your password'
              className='w-full'
              testId='password'
            />

            {errors.password && <p className='text-red-500 dark:text-red-400 text-xs'>{errors.password}</p>}
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className={clsx('w-full font-bold text-white', isLoading && 'opacity-70 cursor-not-allowed')}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          {loginMessage && (
            <div
              className={clsx(
                'p-2 text-center rounded',
                loginMessage.includes('successful')
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
              )}
            >
              {loginMessage}
            </div>
          )}
        </div>

        <UsersList users={users} isLoading={isLoadingUsers} error={usersError} />
      </div>
    </div>
  );
}

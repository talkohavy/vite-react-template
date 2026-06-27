import Button from '@src/components/controls/Button';
import Input from '@src/components/controls/Input';

type LoginPanelProps = {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isLoggedIn: boolean;
  loggedInAs: string;
  isLoginLoading: boolean;
  loginError: string | null;
  onLoginSubmit: () => void;
  onLogoutClick: () => void;
};

export default function LoginPanel(props: LoginPanelProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoggedIn,
    loggedInAs,
    isLoginLoading,
    loginError,
    onLoginSubmit,
    onLogoutClick,
  } = props;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !isLoginLoading && email.trim() && password.trim()) {
      onLoginSubmit();
    }
  }

  return (
    <section className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
      <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
        Authentication
      </h2>

      {isLoggedIn ? (
        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <span className='size-2 rounded-full bg-emerald-500 animate-pulse' />
            <span className='text-sm text-gray-700 dark:text-gray-300'>
              Logged in as <span className='font-semibold text-gray-900 dark:text-white'>{loggedInAs}</span>
            </span>
          </div>

          <Button
            onClick={onLogoutClick}
            className='bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 disabled:hover:bg-gray-600'
          >
            Log out
          </Button>
        </div>
      ) : (
        <div onKeyDown={handleKeyDown}>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3'>
            <div className='min-w-0 flex-1'>
              <label htmlFor='auth-email' className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Email
              </label>

              <Input
                id='auth-email'
                initialValue={email}
                onChange={setEmail}
                placeholder='Enter email'
                disabled={isLoginLoading}
                autoFocus
              />
            </div>

            <div className='min-w-0 flex-1'>
              <label
                htmlFor='auth-password'
                className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Password
              </label>

              <Input
                id='auth-password'
                type='password'
                initialValue={password}
                onChange={setPassword}
                placeholder='Enter password'
                disabled={isLoginLoading}
              />
            </div>

            <div className='shrink-0'>
              <Button
                onClick={onLoginSubmit}
                disabled={isLoginLoading || !email.trim() || !password.trim()}
                className='bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
              >
                {isLoginLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </div>
          </div>

          {loginError && <p className='mt-2 text-sm text-red-600 dark:text-red-400'>{loginError}</p>}
        </div>
      )}
    </section>
  );
}

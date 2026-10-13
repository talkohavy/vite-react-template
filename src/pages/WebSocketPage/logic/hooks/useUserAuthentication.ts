import { startTransition, useActionState, useState } from 'react';
import { API_URLS } from '@src/common/constants';
import { httpClient } from '@src/lib/HttpClient';

type AuthState = {
  loggedInAs: string | null;
  loginError: string | null;
};
type AuthAction =
  | {
      type: 'login';
      email: string;
      password: string;
    }
  | { type: 'logout' };

const INITIAL_AUTH_STATE: AuthState = { loggedInAs: null, loginError: null };

export function useUserAuthentication() {
  const [email, setEmail] = useState('dummy@gmail.com');
  const [password, setPassword] = useState('123456');

  const [authState, dispatchAuthAction, isAuthPending] = useActionState(
    async (_previousState: AuthState, action: AuthAction) => {
      if (action.type === 'logout') {
        await logout();
        setEmail('');

        return INITIAL_AUTH_STATE;
      }

      const newAuthState = await login({ email: action.email, password: action.password });

      if (newAuthState.loggedInAs) setPassword('');

      return newAuthState;
    },
    INITIAL_AUTH_STATE,
  );

  const { loggedInAs, loginError } = authState;

  const onLoginSubmit = () => {
    startTransition(() => dispatchAuthAction({ type: 'login', email: email.trim(), password }));
  };

  const onLogoutClick = () => {
    startTransition(() => dispatchAuthAction({ type: 'logout' }));
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoggedIn: loggedInAs !== null,
    loggedInAs: loggedInAs ?? '',
    isLoginLoading: isAuthPending,
    loginError,
    onLoginSubmit,
    onLogoutClick,
  };
}

type LoginProps = { email: string; password: string };

async function login(props: LoginProps): Promise<AuthState> {
  const { email, password } = props;

  try {
    const { promise } = httpClient.post(API_URLS.authLogin, { body: { email, password } });

    await promise;

    return { loggedInAs: email, loginError: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';

    return { loggedInAs: null, loginError: message };
  }
}

async function logout() {
  try {
    const { promise } = httpClient.post(API_URLS.authLogout, {});
    await promise;
  } catch {
    // best-effort logout — clear client state regardless
  }
}

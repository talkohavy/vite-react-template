import { useCallback, useState } from 'react';
import { API_URLS } from '@src/common/constants';
import { httpClient } from '@src/lib/HttpClient';

export function useUserAuthentication() {
  const [email, setEmail] = useState('dummy@gmail.com');
  const [password, setPassword] = useState('123456');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInAs, setLoggedInAs] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const onLoginSubmit = useCallback(async () => {
    setIsLoginLoading(true);
    setLoginError(null);

    try {
      const { promise } = httpClient.post(API_URLS.authLogin, {
        body: { email: email.trim(), password },
      });

      await promise;

      setIsLoggedIn(true);
      setLoggedInAs(email.trim());
      setPassword('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setLoginError(message);
    } finally {
      setIsLoginLoading(false);
    }
  }, [email, password]);

  const onLogoutClick = useCallback(async () => {
    try {
      const { promise } = httpClient.post(API_URLS.authLogout, {});
      await promise;
    } catch {
      // best-effort logout — clear client state regardless
    }

    setIsLoggedIn(false);
    setLoggedInAs('');
    setEmail('');
  }, []);

  return {
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
  };
}

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userDataSelector } from '@src/store/slices/user/selectors';
import { updateUser } from '@src/store/slices/user/slice';
import { DEFAULT_EMAIL, DEFAULT_PASSWORD } from '../constants';
import { requestLogin, requestLogout, requestProfile, toDemoUser } from '../utils/sseDemoApi';
import { useRequestState } from './useRequestState';

/**
 * The user lives in redux, so when the session can't be refreshed (`onSessionExpired` in main.tsx), the page logs out too.
 */
export function useCurrentUser() {
  const dispatch = useDispatch();
  const userData = useSelector(userDataSelector);

  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [password, setPassword] = useState(DEFAULT_PASSWORD);

  const { isPending, error, run } = useRequestState();

  const user = toDemoUser(userData);

  useEffect(() => {
    let isCancelled = false;

    async function restoreUser() {
      const profile = await requestProfile();

      if (isCancelled || !profile) return;

      dispatch(updateUser({ user: profile, isLogged: true }));
    }

    restoreUser();

    return () => {
      isCancelled = true;
    };
  }, [dispatch]);

  async function login() {
    await run(async () => {
      const loggedInUser = await requestLogin({ email: email.trim(), password });

      dispatch(updateUser({ user: loggedInUser, isLogged: loggedInUser !== null }));
    });
  }

  /**
   * The server closes this session's streams (in every tab) on its own; the page doesn't disconnect them.
   */
  async function logout() {
    await run(async () => {
      try {
        await requestLogout();
      } finally {
        dispatch(updateUser({ user: null, isLogged: false }));
      }
    });
  }

  return { user, email, setEmail, password, setPassword, isPending, error, login, logout };
}

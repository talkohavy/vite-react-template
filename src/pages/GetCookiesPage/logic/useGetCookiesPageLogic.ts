import { useState } from 'react';
import { httpClient } from '@src/lib/HttpClient';
import { useFetchUsers } from './useFetchUsers';

export function useGetCookiesPageLogic() {
  const { users, isLoading: isLoadingUsers, error: usersError } = useFetchUsers();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('1111');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginMessage('');

    try {
      const requestBody = { email, password };

      const data = await httpClient.post('/api/auth/login', { body: requestBody }).promise;

      setLoginMessage('Login successful!');

      console.log('Login response:', data);
    } catch (_error) {
      setLoginMessage('Login failed. Please check your credentials and try again.');
    }

    setIsLoading(false);
  };

  return {
    users,
    isLoadingUsers,
    usersError,
    handleLogin,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    setErrors,
    isLoading,
    loginMessage,
  };
}

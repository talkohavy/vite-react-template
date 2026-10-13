import { useState } from 'react';
import Button from '../../components/controls/Button/Button';
import Input from '../../components/controls/Input/Input';
import { httpClient } from '../../lib/HttpClient';

export default function GetCookiesPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div className='size-full p-6 overflow-auto bg-white dark:bg-gray-900'>
      <h1 className='text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100'>Login</h1>

      <div className='max-w-md mx-auto mb-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-4'>
        <h2 className='text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2'>Test Credentials</h2>
        <p className='text-sm text-blue-700 dark:text-blue-300'>
          <strong>Email:</strong> dummy@gmail.com
        </p>
        <p className='text-sm text-blue-700 dark:text-blue-300'>
          <strong>Password:</strong> 1111
        </p>
      </div>

      <div className='max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md dark:shadow-dark-md rounded-md p-6 border border-gray-200 dark:border-gray-700'>
        <div className='mb-4'>
          <div className='block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2'>Email</div>
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
          {errors.email && <p className='text-red-500 dark:text-red-400 text-xs mt-1'>{errors.email}</p>}
        </div>

        <div className='mb-6'>
          <div className='block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2'>Password</div>
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
          {errors.password && <p className='text-red-500 dark:text-red-400 text-xs mt-1'>{errors.password}</p>}
        </div>

        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full font-bold text-white ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>

        {loginMessage && (
          <div
            className={`mt-4 p-2 text-center rounded ${
              loginMessage.includes('successful')
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}
          >
            {loginMessage}
          </div>
        )}
      </div>
    </div>
  );
}

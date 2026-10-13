import { Navigate } from 'react-router';
import { BASE_URL } from '@src/common/constants';

export default function RedirectToHome() {
  return <Navigate to={`${BASE_URL}/home`} replace />;
}

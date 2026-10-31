import { describe, expect, it, vi } from 'vite-plus/test';
import { toDemoUser } from './sseDemoApi';

vi.mock('@src/lib/HttpClient', () => ({ httpClient: {} }));

describe('toDemoUser', () => {
  it('should keep only the id, as a string, and the email', () => {
    const expectedResult = { id: '7', email: 'dummy@gmail.com' };

    const actualResult = toDemoUser({ id: 7, email: 'dummy@gmail.com', hashed_password: 'hash', role: 'admin' });

    expect(actualResult).toEqual(expectedResult);
  });

  it('should return null without a user', () => {
    const actualResult = toDemoUser(null);

    expect(actualResult).toBeNull();
  });

  it('should return null for a user without an id', () => {
    const actualResult = toDemoUser({ email: 'dummy@gmail.com' });

    expect(actualResult).toBeNull();
  });
});

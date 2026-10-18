import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vite-plus/test';

configure({ testIdAttribute: 'data-test-id' });

afterEach(() => {
  cleanup();
});

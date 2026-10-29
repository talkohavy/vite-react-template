import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import GoogleFontPage from './GoogleFontPage';

describe('GoogleFontPage', () => {
  it('should explain how to bundle Rubik', () => {
    render(<GoogleFontPage />);

    expect(screen.getByRole('heading', { name: 'Bundle a Google Font' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '1. Install the font files' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '2. Import only the files you use' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '3. Use the family name' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '4. Confirm the files are in the build' })).toBeInTheDocument();
  });

  it('should show the bundled weights', () => {
    render(<GoogleFontPage />);

    expect(screen.getByText('Regular 400')).toBeInTheDocument();
    expect(screen.getByText('Medium 500')).toBeInTheDocument();
    expect(screen.getByText('Bold 700')).toBeInTheDocument();
  });
});

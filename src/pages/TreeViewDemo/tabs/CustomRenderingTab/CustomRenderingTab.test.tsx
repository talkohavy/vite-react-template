import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import CustomRenderingTab from './CustomRenderingTab';

describe('CustomRenderingTab', () => {
  it('should render the component', () => {
    render(<CustomRenderingTab />);

    const heading = screen.getByText('Custom Rendering');
    expect(heading).toBeInTheDocument();
  });

  it('should render initial tree data with folders and files', () => {
    render(<CustomRenderingTab />);

    expect(screen.getByText('src')).toBeInTheDocument();
    expect(screen.getByText('public')).toBeInTheDocument();
    expect(screen.getByText('package.json')).toBeInTheDocument();
  });

  it('should show selected node info when a node is clicked', async () => {
    render(<CustomRenderingTab />);

    const packageJsonNode = screen.getByText('package.json');
    fireEvent.click(packageJsonNode);

    await waitFor(() => {
      expect(screen.getByText('Selected Node:')).toBeInTheDocument();
    });
  });

  it('should expand folder and load children dynamically', async () => {
    render(<CustomRenderingTab />);

    const srcFolder = screen.getByText('src');
    const expandButton = srcFolder.parentElement?.querySelector('button');

    if (expandButton) {
      fireEvent.click(expandButton);

      await waitFor(
        () => {
          expect(screen.getByText('components')).toBeInTheDocument();
          expect(screen.getByText('pages')).toBeInTheDocument();
          expect(screen.getByText('App.tsx')).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    }
  });

  it('should display loading indicator when expanding folders', async () => {
    render(<CustomRenderingTab />);

    const srcFolder = screen.getByText('src');
    const expandButton = srcFolder.parentElement?.querySelector('button');

    if (expandButton) {
      fireEvent.click(expandButton);

      // Loading indicator should appear briefly
      const loadingText = screen.queryByText('Loading...');
      expect(loadingText).toBeInTheDocument();

      // Wait for children to load
      await waitFor(
        () => {
          expect(screen.getByText('components')).toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    }
  });
});

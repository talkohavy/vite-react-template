import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import ZoomTab from './ZoomTab';

describe('ZoomTab', () => {
  it('should start at 1x with the 1:110m countries', () => {
    render(<ZoomTab />);

    expect(screen.getByText('1.0×')).toBeInTheDocument();
  });

  it('should double the zoom level when zooming in with the button', () => {
    render(<ZoomTab />);

    fireEvent.click(screen.getByRole('button', { name: '+' }));

    expect(screen.getByText('2.0×')).toBeInTheDocument();
  });

  it('should switch to the 1:50m countries once zoomed in past 3x', async () => {
    render(<ZoomTab />);

    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));

    const detail = await screen.findByText('1:50m', { selector: 'strong' });

    expect(detail).toBeInTheDocument();
  });

  it('should still select a country by clicking it', () => {
    render(<ZoomTab />);

    const map = screen.getByRole('img', { name: /Zoomable world countries/ });
    fireEvent.click(map.querySelector('path[data-name="France"]')!);

    expect(screen.getByText(/properties: \{ name: "France" \}/)).toBeInTheDocument();
  });
});

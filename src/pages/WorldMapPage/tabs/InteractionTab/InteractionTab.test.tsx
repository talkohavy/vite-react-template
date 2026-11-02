import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import InteractionTab from './InteractionTab';

function getCountryPath(props: { name: string }) {
  const { name } = props;

  const map = screen.getByRole('img', { name: /Interactive world countries/ });
  const countryPath = map.querySelector(`path[data-name="${name}"]`)!;

  return countryPath;
}

describe('InteractionTab', () => {
  it('should show the name of the hovered country', () => {
    render(<InteractionTab />);

    fireEvent.pointerOver(getCountryPath({ name: 'France' }));

    expect(screen.getByText('France', { selector: 'strong' })).toBeInTheDocument();
  });

  it('should show the GeoJSON summary of the clicked country', () => {
    render(<InteractionTab />);

    fireEvent.click(getCountryPath({ name: 'Japan' }));

    expect(screen.getByText(/properties: \{ name: "Japan" \}/)).toBeInTheDocument();
  });

  it('should clear the selection when the selected country is clicked again', () => {
    render(<InteractionTab />);

    fireEvent.click(getCountryPath({ name: 'Japan' }));
    fireEvent.click(getCountryPath({ name: 'Japan' }));

    expect(screen.getByText('Click a country to select it.')).toBeInTheDocument();
  });
});

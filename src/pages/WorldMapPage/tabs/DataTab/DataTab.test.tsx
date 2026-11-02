import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import DataTab from './DataTab';

function getCountryPath(name: string) {
  const map = screen.getByRole('img', { name: /colored by population/ });
  const countryPath = map.querySelector(`path[data-name="${name}"]`)!;

  return countryPath;
}

describe('DataTab', () => {
  it('should color countries with data and hatch the ones without', () => {
    render(<DataTab />);

    expect(getCountryPath('France')).toHaveAttribute('fill', expect.stringMatching(/^rgb\(/));
    expect(getCountryPath('Kosovo')).toHaveAttribute('fill', 'url(#world-map-no-data)');
  });

  it('should put China and France in the same quantile class', () => {
    render(<DataTab />);

    const chinaFill = getCountryPath('China').getAttribute('fill');
    const franceFill = getCountryPath('France').getAttribute('fill');

    expect(chinaFill).toBe(franceFill);
  });

  it('should tell China and France apart on a log scale', () => {
    const { container } = render(<DataTab />);

    fireEvent.click(container.querySelector('input[value="log"]')!);
    const chinaFill = getCountryPath('China').getAttribute('fill');
    const franceFill = getCountryPath('France').getAttribute('fill');

    expect(chinaFill).not.toBe(franceFill);
  });

  it('should recolor countries when switching to density', () => {
    const { container } = render(<DataTab />);
    const populationFill = getCountryPath('Russia').getAttribute('fill');

    fireEvent.click(container.querySelector('input[value="density"]')!);
    const densityFill = getCountryPath('Russia').getAttribute('fill');

    expect(densityFill).not.toBe(populationFill);
  });

  it('should show the joined row when hovering a country', () => {
    render(<DataTab />);

    fireEvent.pointerOver(getCountryPath('Dem. Rep. Congo'));

    expect(screen.getByText(/row 180 \(Democratic Republic of the Congo\)/)).toBeInTheDocument();
  });

  it('should show the feature next to its row when clicking a country', () => {
    render(<DataTab />);

    fireEvent.click(getCountryPath('France'));

    expect(screen.getByText(/"population": 67059887/)).toBeInTheDocument();
  });
});

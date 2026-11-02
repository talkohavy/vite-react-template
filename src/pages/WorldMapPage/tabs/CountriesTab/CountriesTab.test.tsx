import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { WORLD_COUNTRIES } from '../../logic/data/worldCountries';
import CountriesTab from './CountriesTab';

describe('CountriesTab', () => {
  it('should draw the sphere, the graticule and one path per country', () => {
    render(<CountriesTab />);

    const map = screen.getByRole('img', { name: /World countries/ });
    const pathCount = map.querySelectorAll('path').length;

    expect(pathCount).toEqual(WORLD_COUNTRIES.length + 2);
  });

  it('should show France as a MultiPolygon feature', () => {
    render(<CountriesTab />);

    const summary = screen.getByText(/type: "MultiPolygon"/);

    expect(summary).toHaveTextContent('properties: { name: "France" }');
  });
});

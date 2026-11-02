import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { WORLD_COUNTRIES } from '../../logic/data/worldCountries';
import SimpleFeaturesTab from './SimpleFeaturesTab';

describe('SimpleFeaturesTab', () => {
  it('should draw the four hand-written features on top of the countries', () => {
    render(<SimpleFeaturesTab />);

    const map = screen.getByRole('img', { name: /hand-written features/ });
    const pathCount = map.querySelectorAll('path').length;

    expect(pathCount).toEqual(2 + WORLD_COUNTRIES.length + 4);
  });

  it('should report a tiny share of the globe for the clockwise triangle', () => {
    render(<SimpleFeaturesTab />);

    const share = screen.getByText('0.2%');

    expect(share).toBeInTheDocument();
  });

  it('should report almost the whole globe once the triangle is reversed', () => {
    render(<SimpleFeaturesTab />);

    fireEvent.click(screen.getByRole('checkbox', { hidden: true }));

    const share = screen.getByText('99.8%');

    expect(share).toBeInTheDocument();
  });
});

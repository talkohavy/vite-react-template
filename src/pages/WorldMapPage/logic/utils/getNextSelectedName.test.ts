import { describe, expect, it } from 'vite-plus/test';
import { getNextSelectedName } from './getNextSelectedName';

describe('getNextSelectedName', () => {
  it('should select the clicked country when nothing is selected', () => {
    const actualResult = getNextSelectedName({ selectedName: null, clickedName: 'France' });

    expect(actualResult).toEqual('France');
  });

  it('should switch the selection to a different clicked country', () => {
    const actualResult = getNextSelectedName({ selectedName: 'France', clickedName: 'Spain' });

    expect(actualResult).toEqual('Spain');
  });

  it('should clear the selection when the selected country is clicked again', () => {
    const actualResult = getNextSelectedName({ selectedName: 'France', clickedName: 'France' });

    expect(actualResult).toBeNull();
  });

  it('should clear the selection when the click lands outside any country', () => {
    const actualResult = getNextSelectedName({ selectedName: 'France', clickedName: null });

    expect(actualResult).toBeNull();
  });
});

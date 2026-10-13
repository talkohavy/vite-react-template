import { act, render, screen } from '@testing-library/react';
import SuspenseUntilReady from './SuspenseUntilReady';

describe('SuspenseUntilReady', () => {
  it('should render the loader until the promise resolves', async () => {
    const promise = new Promise<void>(() => {});

    await act(async () => {
      render(
        <SuspenseUntilReady promise={promise} Loader={<div>loading</div>}>
          <div>ready</div>
        </SuspenseUntilReady>,
      );
    });

    const expectedResult = { isLoaderShown: true, isChildShown: false };
    const actualResult = {
      isLoaderShown: screen.queryByText('loading') !== null,
      isChildShown: screen.queryByText('ready') !== null,
    };

    expect(actualResult).toEqual(expectedResult);
  });

  it('should render the children once the promise resolves', async () => {
    const promise = Promise.resolve();

    await act(async () => {
      render(
        <SuspenseUntilReady promise={promise} Loader={() => <div>loading</div>}>
          <div>ready</div>
        </SuspenseUntilReady>,
      );
    });

    const expectedResult = { isLoaderShown: false, isChildShown: true };
    const actualResult = {
      isLoaderShown: screen.queryByText('loading') !== null,
      isChildShown: screen.queryByText('ready') !== null,
    };

    expect(actualResult).toEqual(expectedResult);
  });
});

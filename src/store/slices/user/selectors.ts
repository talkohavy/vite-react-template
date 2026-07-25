import type { State } from '@src/store';

export const isUserLoadingSelector = (state: State) => state.user.isLoading;

export const userDataSelector = (state: State) => state.user.data;

export const userDataIdSelector = (state: State) => state.user.data?.id;

import { createReducer } from '@reduxjs/toolkit';

import { HANDLE_REFRESH } from '../types';

export interface IRefreshState {
	// Bumped after every successful transaction so data hooks that include it in
	// their effect deps refetch on-chain data without a full page reload.
	refreshKey: number;
}

const initialState: IRefreshState = {
	refreshKey: 0
};

export default createReducer(initialState, (builder) => {
	builder.addCase(HANDLE_REFRESH, (state) => {
		state.refreshKey += 1;
	});
});

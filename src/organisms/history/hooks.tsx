import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import { getHistoryByAddress } from '../../utils/graphqlQuery';
import { IHistoryByAddressState } from '../../interfaces/history';
import { useRefreshStore, useWalletStore } from '../../store';

const ITEMS_PER_PAGE = 50;

export const useHistoryByAddress = () => {
	const [historyByAddressState, setHistoryByAddressState] = useState<IHistoryByAddressState>({
		historyList: [],
		loading: false,
		hasMore: true,
		offset: 0
	});
	const { address } = useWalletStore((state) => state);
	const refreshKey = useRefreshStore((state) => state.refreshKey);
	const { enqueueSnackbar } = useSnackbar();

	const formatHistoryList = (data: any) => {
		return data.messagesByAddress.map((message: any) => {
			return {
				height: message.transaction.height,
				hash: message.transaction.hash,
				type: message.transaction.messages[0]['@type'],
				memo: message.transaction.memo,
				timestamp: message.transaction.block.timestamp,
				success: message.transaction.success
			};
		});
	};

	const loadHistoryData = useCallback(
		async (offset: number = 0, isInitialLoad: boolean = false) => {
			if (!address || (!isInitialLoad && historyByAddressState.loading)) return;

			setHistoryByAddressState((prev) => ({ ...prev, loading: true }));

			try {
				const data = await getHistoryByAddress(address, '', ITEMS_PER_PAGE, offset);

				if (data) {
					const newHistoryList = formatHistoryList(data);
					const hasMore = newHistoryList.length === ITEMS_PER_PAGE;

					setHistoryByAddressState((prev) => ({
						...prev,
						historyList: isInitialLoad ? newHistoryList : [...prev.historyList, ...newHistoryList],
						loading: false,
						hasMore,
						offset: offset + ITEMS_PER_PAGE
					}));
				} else {
					setHistoryByAddressState((prev) => ({
						...prev,
						loading: false,
						hasMore: false
					}));
				}
			} catch (error) {
				console.log(error);
				enqueueSnackbar('Failed to get history.', { variant: 'error', autoHideDuration: 2000 });
				setHistoryByAddressState((prev) => ({
					...prev,
					loading: false,
					hasMore: false
				}));
			}
		},
		[address, historyByAddressState.loading]
	);

	const loadMore = useCallback(() => {
		if (!historyByAddressState.loading && historyByAddressState.hasMore) {
			loadHistoryData(historyByAddressState.offset, false);
		}
	}, [historyByAddressState.loading, historyByAddressState.hasMore, historyByAddressState.offset, loadHistoryData]);

	// Init load data
	useEffect(() => {
		if (address) {
			setHistoryByAddressState({
				historyList: [],
				loading: false,
				hasMore: true,
				offset: 0
			});
			loadHistoryData(0, true);
		}
	}, [address, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		historyByAddressState,
		loadMore
	};
};

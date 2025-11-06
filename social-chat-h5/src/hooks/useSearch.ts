/**
 * useSearch Hook - 搜索管理逻辑
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { searchAsync, fetchHistoryAsync, deleteHistoryAsync, clearResult } from '@/store/slices/searchSlice';
import { SearchParams } from '@/types/models';
import { SSDialog } from '@/components/SSDialog';

export const useSearch = () => {
  const dispatch = useAppDispatch();
  const { result, loading, history } = useAppSelector((state) => state.search);

  const search = useCallback(
    async (params: SearchParams) => {
      try {
        await dispatch(searchAsync(params)).unwrap();
      } catch (error) {
        SSDialog.toast.error('搜索失败');
      }
    },
    [dispatch]
  );

  const loadHistory = useCallback(async () => {
    try {
      await dispatch(fetchHistoryAsync()).unwrap();
    } catch (error) {
      console.error('加载历史失败:', error);
    }
  }, [dispatch]);

  const deleteHistory = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteHistoryAsync(id)).unwrap();
      } catch (error) {
        SSDialog.toast.error('删除失败');
      }
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearResult());
  }, [dispatch]);

  return { result, loading, history, search, loadHistory, deleteHistory, clear };
};

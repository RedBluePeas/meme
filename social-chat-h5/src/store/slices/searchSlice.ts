/**
 * SearchSlice - 搜索模块状态管理
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SearchResult, SearchParams, SearchHistory } from '@/types/models';
import { searchApi } from '@/services/api';

interface SearchState {
  result: SearchResult;
  loading: boolean;
  history: SearchHistory[];
}

const initialState: SearchState = {
  result: { users: [], posts: [], groups: [] },
  loading: false,
  history: [],
};

export const searchAsync = createAsyncThunk('search/search', async (params: SearchParams) => {
  const result = await searchApi.globalSearch(params);
  // 保存搜索历史
  await searchApi.saveSearchHistory(params.keyword);
  return result;
});

export const fetchHistoryAsync = createAsyncThunk('search/fetchHistory', async () => {
  return await searchApi.getSearchHistory();
});

export const deleteHistoryAsync = createAsyncThunk('search/deleteHistory', async (id: string) => {
  await searchApi.deleteSearchHistory(id);
  return id;
});

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearResult: (state) => {
      state.result = { users: [], posts: [], groups: [] };
    },
    resetSearchState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(searchAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchHistoryAsync.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(deleteHistoryAsync.fulfilled, (state, action) => {
        state.history = state.history.filter((h) => h.id !== action.payload);
      });
  },
});

export const { clearResult, resetSearchState } = searchSlice.actions;
export default searchSlice.reducer;

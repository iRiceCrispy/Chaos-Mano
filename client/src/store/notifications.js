import axios from 'axios';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async () => {
    const res = await axios.get('/api/notifications');

    return res.data;
  },
);

const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = notificationsAdapter.getInitialState();

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, notificationsAdapter.setAll);
  },
});

export const notificationsSelectors = notificationsAdapter
  .getSelectors(state => state.notifications);

export default notificationsSlice.reducer;

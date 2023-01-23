import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { API, User } from 'app/api';
import { wait } from 'shared/utils/wait';

export interface UsersState {
  status: 'idle' | 'loading' | 'failed';
  list: User[];
}

const initialState: UsersState = {
  status: 'idle',
  list: [],
};

export const fetchUsersAsync = createAsyncThunk(
  'users/fetch',
  async () => {
    await wait(1000);
    return await API.getUsers();
  },
);

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    editUser: (state, action: PayloadAction<User>) => {
      const index = (state.list || []).findIndex((i) => i.id === action.payload.id);
      if (index > -1) {
        state.list[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = action.payload;
      })
      .addCase(fetchUsersAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const UsersActions = usersSlice.actions;

export const selectUsers = (state: RootState) => state.users;

export default usersSlice.reducer;

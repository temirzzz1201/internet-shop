import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUsers } from '@/actions/clientActions';
import { IUsersState, IUser } from '../types';

export const initialState: IUsersState = {
  users: [],
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getUsers.fulfilled,
        (state, action: PayloadAction<IUser[]>) => {
          state.isLoading = false;
          state.users = action.payload;
        }
      )
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Что-то пошло не так';
      });
  },
});

export default usersSlice.reducer;


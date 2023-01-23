import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import usersReducer from './users.slice';
import postsReducer from './posts.slice';
import todosReducer from './todos.slice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    todos: todosReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

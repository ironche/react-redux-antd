import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { API, Todo, User } from 'app/api';
import { wait } from 'shared/utils/wait';

export type TodoListItem = Todo & { user?: User };

export interface TodosState {
  status: 'idle' | 'loading' | 'failed';
  list: TodoListItem[];
  page: number;
  pageSize: number;
  userFilter: string;
  titleFilter: string;
  statusFilters: boolean[];
}

const initialState: TodosState = {
  status: 'idle',
  list: [],
  page: 0,
  pageSize: 10,
  userFilter: '',
  titleFilter: '',
  statusFilters: [true, false],
};

export const fetchTodosAsync = createAsyncThunk(
  'todos/fetch',
  async () => {
    await wait(500);

    const users = new Map<number, User>();
    (await API.getUsers()).forEach((user) => {
      users.set(user.id, user);
    });

    const todos = await API.getTodos();
    return todos.map((todo) => {
      const user = users.get(todo.userId);
      return {...todo, user};
    });
  },
);

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number | string>) => {
      state.page = +action.payload;
    },
    setPageSize: (state, action: PayloadAction<number | string>) => {
      state.page = 0;
      state.pageSize = +action.payload;
    },
    setUserFilter: (state, action: PayloadAction<string>) => {
      state.page = 0;
      state.userFilter = action.payload || '';
    },
    setTitleFilter: (state, action: PayloadAction<string>) => {
      state.page = 0;
      state.titleFilter = action.payload || '';
    },
    setStatusFilters: (state, action: PayloadAction<boolean[]>) => {
      state.page = 0;
      state.statusFilters = action.payload;
    },
    toggleStatus: (state, action: PayloadAction<TodoListItem>) => {
      const index = state.list.findIndex((item) => item.id === action.payload.id);
      const newItem = Object.assign({}, action.payload, { completed: !action.payload.completed } as Partial<TodoListItem>);
      state.list[index] = newItem;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodosAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = action.payload;
      })
      .addCase(fetchTodosAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const TodosActions = todosSlice.actions;

export const selectTodos = (state: RootState) => state.todos;

export default todosSlice.reducer;

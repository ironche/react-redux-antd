import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { API, Post } from 'app/api';
import { wait } from 'shared/utils/wait';

export interface PostsState {
  status: 'idle' | 'loading' | 'failed';
  list: Post[];
}

const initialState: PostsState = {
  status: 'idle',
  list: [],
};

export const fetchPostsAsync = createAsyncThunk(
  'posts/fetch',
  async (id: number) => {
    await wait(500);
    return await API.getPostsByUserId(id);
  },
);

export const deletePostAsync = createAsyncThunk(
  'post/delete',
  async (id: number) => {
    return await API.deletePost(id);
  },
);

export const editPostAsync = createAsyncThunk(
  'post/edit',
  async (post: Post) => {
    return await API.editPost(post);
  },
);

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.list = action.payload;
      })
      .addCase(fetchPostsAsync.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(deletePostAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = (state.list || []).findIndex((i) => i.id === action.payload);
        if (index > -1) {
          state.list.splice(index, 1);
        }
      })
      .addCase(deletePostAsync.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(editPostAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editPostAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        const index = (state.list || []).findIndex((i) => i.id === action.payload.id);
        if (index > -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(editPostAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const PostsActions = postsSlice.actions;

export const selectPosts = (state: RootState) => state.posts;

export default postsSlice.reducer;

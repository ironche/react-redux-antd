import { Collapse, Button, Empty, Skeleton, List, Typography, Space, Modal } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { selectPosts, fetchPostsAsync, deletePostAsync, editPostAsync } from 'app/store/posts.slice';
import { selectUsers, fetchUsersAsync, UsersActions } from 'app/store/users.slice';
import { User, Post } from 'app/api';
import { UserDetailsForm } from 'shared/components/UserDetailsForm';
import { PostDetailsForm } from 'shared/components/PostDetailsForm';

export default function Posts() {
  const postsStore = useAppSelector(selectPosts);
  const usersStore = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();
  const { userId } = useParams();
  const [deletePost, setDeletePost] = useState<Post>();
  const [editPost, setEditPost] = useState<Post>();

  useEffect(() => {
    if (userId) {
      dispatch(fetchPostsAsync(+userId));
    }
    if (!usersStore.list.length) {
      dispatch(fetchUsersAsync());;
    }
  }, [userId, usersStore.list, dispatch]);

  const user = useMemo<User | undefined>(() => {
    if (userId) {
      return (usersStore.list || []).find((ul) => ul.id === +userId);
    }
  }, [userId, usersStore.list]);

  function onFormSubmit(values: User) {
    dispatch(UsersActions.editUser(values));
  }

  function onDeletePost(): void {
    if (typeof deletePost?.id !== 'undefined') {
      dispatch(deletePostAsync(deletePost.id));
      setDeletePost(undefined);
    }
  }

  function onEditPost(post: Post): void {
    dispatch(editPostAsync(post));
    setEditPost(undefined);
  }

  if (usersStore.status === 'loading') {
    return (<Skeleton active paragraph={{ rows: 10 }} />);
  } else if (usersStore.status === 'failed' || !usersStore.list.length) {
    return (<Empty />);
  }
  return (
    <>
      {!user && (
        <Empty />
      )}
      {user && (
        <>
          <Collapse>
            <Collapse.Panel key={user.id} header={'User details: ' + user.name + ' (expand to edit)'}>
              <UserDetailsForm user={user} onEdit={onFormSubmit} />
            </Collapse.Panel>
          </Collapse>

          <Space align="center" direction="vertical">
            <Typography.Title level={2}>Posts</Typography.Title>
          </Space>

          {postsStore.status === 'loading' && (
            <Skeleton active paragraph={{ rows: 10 }} />
          )}
          {postsStore.status === 'failed' && (
            <Empty />
          )}
          {postsStore.status === 'idle' && (
            <List
              itemLayout="horizontal"
              dataSource={postsStore.list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" onClick={() => setEditPost(item)}>edit</Button>,
                    <Button type="link" danger onClick={() => setDeletePost(item)}>delete</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={item.title}
                    description={item.body}
                  />
                </List.Item>
              )}
            />
          )}

          <Modal
            open={Boolean(deletePost)}
            title="Please confirm that the following post will be deleted"
            onOk={() => onDeletePost()}
            onCancel={() => setDeletePost(undefined)}
            closable={false}
          >
            <Space direction="vertical">
              <Typography.Text strong>
                {deletePost?.title}
              </Typography.Text>
              <Typography.Text>
                {deletePost?.body}
              </Typography.Text>
            </Space>
          </Modal>

          <Modal
            open={Boolean(editPost)}
            title="Edit post"
            footer={[]}
            closable={false}
          >
            <PostDetailsForm
              post={editPost as Post}
              onEdit={onEditPost}
              onCancel={() => setEditPost(undefined)}
            />
          </Modal>
        </>
      )}
    </>
  );
}

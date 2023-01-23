import { Collapse, Button, Empty, Skeleton } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { selectUsers, fetchUsersAsync, UsersActions } from 'app/store/users.slice';
import { User } from 'app/api';
import { UserDetailsForm } from 'shared/components/UserDetailsForm';

export default function Users() {
  const usersStore = useAppSelector(selectUsers);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, [dispatch]);

  function onFormSubmit(values: User) {
    dispatch(UsersActions.editUser(values));
  }

  if (usersStore.status === 'loading') {
    return (<Skeleton active paragraph={{ rows: 10 }} />);
  } else if (usersStore.status === 'failed' || !usersStore.list.length) {
    return (<Empty />);
  }
  return (
    <Collapse accordion>
      {usersStore.list.map((user) => (
        <Collapse.Panel key={user.id} header={user.name}>
          <UserDetailsForm user={user} onEdit={onFormSubmit} />
          <Button type="primary" block onClick={() => navigate(`./posts/${user.id}`)}>
            See posts
          </Button>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
}

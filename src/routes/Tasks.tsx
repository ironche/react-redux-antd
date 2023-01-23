import { useEffect, useMemo } from 'react';
import { Empty, Skeleton, Space, Tag, Typography, Button, Select, Checkbox, Input, Collapse } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { selectTodos, fetchTodosAsync, TodosActions, TodoListItem } from 'app/store/todos.slice';

const StatusOptions = [
  { label: 'Done', value: true },
  { label: 'To do', value: false },
];

export default function Tasks() {
  const todosStore = useAppSelector(selectTodos);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodosAsync());
  }, [dispatch]);

  const filteredList = useMemo<TodoListItem[]>(() => {
    return todosStore.list.filter((item) => {
      const {userFilter, titleFilter, statusFilters} = todosStore;
      const user = userFilter ? new RegExp(userFilter, 'gi').test(item.user?.name ?? '') : true;
      const title = titleFilter ? new RegExp(titleFilter, 'gi').test(item.title) : true;
      const completed = statusFilters.includes(item.completed);
      return user && title && completed;
    });
  }, [todosStore]);

  const tableData = useMemo(()=> {
    const start = todosStore.page * todosStore.pageSize;
    const end = start + todosStore.pageSize;
    return filteredList.slice(start, end);
  }, [todosStore, filteredList]);

  const isPrevDisabled = useMemo(() => {
    return todosStore.page === 0;
  }, [todosStore.page]);

  const isNextDisabled = useMemo(() => {
    const start = todosStore.page * todosStore.pageSize;
    const end = start + todosStore.pageSize;
    return end >= filteredList.length;
  }, [filteredList, todosStore.page, todosStore.pageSize]);

  function onFilterUser(value: string) {
    dispatch(TodosActions.setUserFilter(value));
  }

  function onFilterTitle(value: string) {
    dispatch(TodosActions.setTitleFilter(value));
  }

  function onFilterStatus(checkedValues: CheckboxValueType[]) {
    dispatch(TodosActions.setStatusFilters(checkedValues as boolean[]));
  }

  function onToggleStatus(value: TodoListItem): void {
    dispatch(TodosActions.toggleStatus(value));
  }

  function onPageSizeChange(value: string): void {
    dispatch(TodosActions.setPageSize(value));
  }

  if (todosStore.status === 'loading') {
    return (<Skeleton active paragraph={{ rows: 10 }} />);
  } else if (todosStore.status === 'failed') {
    return (<Empty />);
  }
  return (
    <div>
      <header className="data-table-header">
        <Collapse accordion>
          <Collapse.Panel key={0} header="Filter todos">
            <Space direction="vertical">
              <Typography>
                Filter by user
              </Typography>
              <Input.Search
                allowClear
                enterButton
                onSearch={onFilterUser}
              />
              <Typography>
                Filter by title
              </Typography>
              <Input.Search
                allowClear
                enterButton
                onSearch={onFilterTitle}
              />
              <Typography>
                Filter by status
              </Typography>
              <Checkbox.Group
                options={StatusOptions}
                defaultValue={todosStore.statusFilters}
                onChange={onFilterStatus}
              />
            </Space>
          </Collapse.Panel>
        </Collapse>
      </header>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.user?.name ?? row.userId}</td>
              <td>{row.title}</td>
              <td className="center-cell">
                <Tag color={row.completed ? "green" : "red"}>
                  {row.completed ? 'Done' : 'To do'}
                </Tag>
              </td>
              <td className="center-cell">
                <Button onClick={() => onToggleStatus(row)}>Toggle status</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="data-table-footer">
        <Space direction="horizontal">
          <Typography>
            Page {todosStore.page + 1} of {Math.ceil(filteredList.length / todosStore.pageSize)}
          </Typography>
          <Button
            icon={<LeftOutlined />}
            disabled={isPrevDisabled}
            onClick={() => dispatch(TodosActions.setPage(todosStore.page - 1))}
          >
            Previous page
          </Button>
          <Button
            icon={<RightOutlined />}
            disabled={isNextDisabled}
            onClick={() => dispatch(TodosActions.setPage(todosStore.page + 1))}
          >
            Next page
          </Button>
          <Typography>
            Page size
          </Typography>
          <Select
            defaultValue={todosStore.pageSize.toString()}
            onChange={onPageSizeChange}
            options={[
              { value: 10, label: 10 },
              { value: 25, label: 25 },
              { value: 50, label: 50 },
            ]}
          />
          <Typography>
            Total results: {filteredList.length}.
          </Typography>
        </Space>
      </footer>
    </div>
  );
}

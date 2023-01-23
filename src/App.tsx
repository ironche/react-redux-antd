import { createBrowserRouter, RouterProvider, NavLink } from 'react-router-dom';
import RootRoute from 'routes';
import UserListRoute from 'routes/Users';
import UserPostsRoute from 'routes/Posts';
import TasksRoute from 'routes/Tasks';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
    children: [
      {
        index: true,
        element: <UserListRoute />,
      },
      {
        path: 'posts/:userId',
        element: <UserPostsRoute />,
      },
      {
        path: 'tasks',
        element: <TasksRoute />,
      },
    ]
  },
], {
  basename: process.env.REACT_APP_ROUTE_BASENAME,
});

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}


import { NavLink, Outlet } from 'react-router-dom';
import { Space } from 'antd';

export default function Root() {
  return (
    <>
      <nav className="app-nav">
        <Space size="large">
          <NavLink to={'/'}>User list</NavLink>
          <NavLink to={'/posts/2'}>Posts of Ervin Howell</NavLink>
          <NavLink to={'/tasks'}>Tasks</NavLink>
        </Space>
      </nav>
      <Outlet/>
    </>
  );
}

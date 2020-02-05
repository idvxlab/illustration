import React from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import UploadSvg from './pages/upload-svg';
import DragSvg from './pages/drag-svg';
import Zoom from './pages/zoom';
import SvgTreeStructure from './pages/svg-tree-structure';
import AutoJoint from './pages/auto-joint';
import Hitu from './pages/hitu';
import HandlerWithHitu from './pages/handler';


const Routes = [
  { path: '/upload-svg', name: '1 上传 svg', page: UploadSvg },
  { path: '/drag-svg', name: '2 拖拽添加 svg', page: DragSvg },
  { path: '/zoom', name: '3 d3.zoom 缩放', page: Zoom },
  { path: '/svg-tree-structure', name: '4 解析 svg 结构', page: SvgTreeStructure },
  { path: '/auto-joint', name: '5 自动拼接', page: AutoJoint },
  { path: '/hitu', name: '6 hitu 组件', page: Hitu },
  { path: '/handler-with-hitu', name: '7 结合hitu组件进行拖拽', page: HandlerWithHitu },
]

const { Content, Sider } = Layout;

const Router = () => (
  <BrowserRouter>
    <Layout style={{ height: '100vh' }}>
      <Sider>
        <div className="logo" />
        <Menu theme="dark" mode="inline">
          {Routes.map(r => (
            <Menu.Item key={r.path}>
              <Link to={r.path}>{r.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
          <Switch>
            {Routes.map(r => {
              let Comp = r.page;
              return <Route exact path={r.path} key={r.path}><Comp /></Route>
            })}
          </Switch>
        </Content>
      </Layout>
    </Layout>
  </BrowserRouter>
);

export default Router;
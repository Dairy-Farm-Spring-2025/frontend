import { Avatar, Divider, Layout, Menu, MenuProps, theme } from "antd";
import React, { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { PiCow, PiFarmLight } from "react-icons/pi";
import { Link, Outlet } from "react-router-dom";
import ButtonComponent from "../../components/Button/ButtonComponent";
import "./index.scss";
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <Link to={`/${key}`}>{label}</Link>,
  } as MenuItem;
}

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  zIndex: 1,
};

const items: MenuItem[] = [
  getItem("Dairy Management", "dairy-management", <PiFarmLight />),
  getItem("Cow Management", "cow-management", <PiCow />),
];

const AppDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={270}
        style={siderStyle}
        className="bg-white"
      >
        <div className="demo-logo-vertical" />
        <div className="bg-white p-3 flex flex-col gap-2 items-center">
          <Avatar size={64} />
          <div className="w-full text-center">
            <p className={`font-bold ${collapsed ? "text-xs" : "text-base"}`}>
              John Doe
            </p>
            <p className="text-xs">Role</p>
          </div>
          <ButtonComponent
            icon={<BiLogOut />}
            variant="outlined"
            color="danger"
            className="!w-full !text-base"
          >
            {!collapsed && <p>Logout</p>}
          </ButtonComponent>
        </div>
        <Divider className="!m-0 border-white" />
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          className="!text-base"
        />
      </Sider>
      <Layout
        style={{ marginLeft: collapsed ? 80 : 270 }}
        className="duration-300"
      >
        <Header
          style={{ background: colorBgContainer }}
          className="!shadow-md !bg-gradient-to-r from-green-800 via-green-700 to-green-600 flex items-center"
        >
          <p className="text-2xl font-bold text-white">Dairy Farm Management</p>
        </Header>
        <Content style={{ padding: "0 32px" }} className="!pt-5 !bg-slate-200">
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflowY: "auto",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppDashboard;

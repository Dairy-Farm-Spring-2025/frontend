import { MenuProps } from "antd";
import "./index.css";
import { Dropdown, Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import { MdOutlineAccountCircle } from "react-icons/md";
import { Link, Outlet } from "react-router-dom";
import { MoneyCollectOutlined } from "@ant-design/icons";
import { IoLogOutSharp } from "react-icons/io5";

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
  getItem("Dairy Management", "dairy-management", <MoneyCollectOutlined />),
];

const AppDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const itemsUser: MenuProps["items"] = [
    {
      key: "infor",
      label: <div className="flex flex-col gap-1">dsad</div>,
    },
    {
      key: "Logout",
      label: <div className="text-red-500 text-base">Logout</div>,
      icon: <IoLogOutSharp className="text-red-500" size={20} />,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={270}
        className="bg-green-700"
        style={siderStyle}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          className="!text-base bg-green-700"
        />
      </Sider>
      <Layout
        style={{ marginLeft: collapsed ? 80 : 270 }}
        className="duration-300"
      >
        <Header style={{ background: colorBgContainer }} className="shadow-md">
          <div className="w-full h-full flex justify-end items-center gap-4">
            <Dropdown
              menu={{ items: itemsUser }}
              placement="bottomLeft"
              arrow
              trigger={["click"]}
              className="cursor-pointer hover:opacity-70 duration-300"
              overlayStyle={{ width: 200 }}
            >
              <MdOutlineAccountCircle size={40} />
            </Dropdown>
          </div>
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

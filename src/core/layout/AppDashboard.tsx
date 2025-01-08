import { Avatar, Divider, Dropdown, Layout, Menu, MenuProps } from "antd";
import React, { useState } from "react";
import { PiCow, PiFarmLight } from "react-icons/pi";
import { SiHappycow } from "react-icons/si";
import { IoIosNotifications } from "react-icons/io";
import { Link, Outlet } from "react-router-dom";
import "./index.scss";
const { Header, Content, Sider } = Layout;

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

const itemsMenu: MenuItem[] = [
  getItem("Dairy Management", "dairy-management", <PiFarmLight />),
  getItem("Cow Management", "cow-management", <PiCow />),
];

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },

  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "4",
    danger: true,
    label: "a danger item",
  },
];

const AppDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }} className="layout-dairy">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={270}
        style={siderStyle}
        className="sider-dairy bg-white border-r-2"
      >
        <div className="demo-logo-vertical" />
        <div
          className={`bg-white p-3 flex ${
            collapsed ? " justify-center" : "gap-4 justify-start"
          } items-center`}
        >
          <SiHappycow className="text-green-900" size={52} />
          {collapsed ? (
            <p></p>
          ) : (
            <p className="text-2xl font-bold text-black">Dairy Farm</p>
          )}
        </div>
        {/* <div className="bg-white p-3 flex flex-col gap-2 items-center">
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
        </div> */}
        <Divider className="!m-0 border-white" />
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={itemsMenu}
          className="menu-sider !text-base"
        />
      </Sider>
      <Layout
        style={{ marginLeft: collapsed ? 80 : 270 }}
        className="duration-300"
      >
        <Header className="!bg-white flex items-center gap-5 justify-end">
          <IoIosNotifications
            className="cursor-pointer text-orange-600"
            size={32}
          />
          <div>
            <Dropdown
              trigger={["click"]}
              className="cursor-pointer"
              menu={{ items }}
            >
              <Avatar size={32} />
            </Dropdown>
          </div>
        </Header>
        <Content style={{ padding: "10px" }} className=" !bg-slate-200">
          <div
            style={{
              padding: 8,
              minHeight: 360,
              overflowY: "auto",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppDashboard;

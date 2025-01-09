import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  ConfigProvider,
  Divider,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  theme,
} from "antd";
import React, { useState } from "react";
import { CiBoxList } from "react-icons/ci";
import { IoIosLogOut, IoIosNotifications } from "react-icons/io";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { PiCow, PiFarmLight, PiPlus } from "react-icons/pi";
import { SiHappycow } from "react-icons/si";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/Button/ButtonComponent";
import "./index.scss";
const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
const { useToken } = theme;

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

const AppDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { token } = useToken();
  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: "none",
  };
  const sizeIcon = !collapsed ? 15 : 0;

  const handleNavigate = (link: string) => navigate(link);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div
          className="flex flex-col"
          onClick={() => handleNavigate("profile")}
        >
          <p className="text-base font-bold">Nguyen Van A</p>
          <p className="text-slate-500">Staff</p>
        </div>
      ),
    },
  ];

  const itemsMenu: MenuItem[] = [
    getItem("Dairy Management", "dairy-management", <PiFarmLight />),
    getItem("Cow Management", "cow-management", <PiCow />, [
      getItem("List Cow", "cow-management", <CiBoxList size={sizeIcon} />),
      getItem(
        "Create Cow",
        "cow-management/create-cow",
        <PiPlus size={sizeIcon} />
      ),
      getItem(
        "Health Report",
        "cow-management/health-report",
        <MdOutlineHealthAndSafety size={sizeIcon} />
      ),
    ]),
  ];
  return (
    <Layout style={{ minHeight: "100vh" }} className="layout-dairy">
      <Sider
        trigger={null}
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
        <Header
          className="!bg-white flex items-center gap-5 justify-between"
          style={{ padding: 0 }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div className="flex items-center gap-5 pr-16">
            <IoIosNotifications
              className="cursor-pointer text-orange-600"
              size={32}
            />
            <div>
              <ConfigProvider
                dropdown={{
                  style: {
                    minWidth: 200,
                  },
                }}
              >
                <Dropdown
                  trigger={["click"]}
                  className="cursor-pointer"
                  menu={{ items }}
                  dropdownRender={(menu) => (
                    <div style={contentStyle}>
                      {React.cloneElement(
                        menu as React.ReactElement<{
                          style: React.CSSProperties;
                        }>,
                        {
                          style: menuStyle,
                        }
                      )}
                      <Divider style={{ margin: 0 }} />
                      <div style={{ padding: 8 }}>
                        <ButtonComponent
                          type="primary"
                          danger
                          className="!w-full font-bold"
                          icon={<IoIosLogOut size={20} />}
                        >
                          Logout
                        </ButtonComponent>
                      </div>
                    </div>
                  )}
                >
                  <Avatar size={32} />
                </Dropdown>
              </ConfigProvider>
            </div>
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

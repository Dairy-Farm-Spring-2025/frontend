import {
  Avatar,
  Breadcrumb,
  ConfigProvider,
  Divider,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  theme,
} from "antd";
import React from "react";
import { CiBoxList } from "react-icons/ci";
import { IoIosLogOut, IoIosNotifications } from "react-icons/io";
import { LiaChartAreaSolid, LiaProductHunt } from "react-icons/lia";
import {
  MdOutlineHealthAndSafety,
  MdOutlineFastfood,
  MdSchedule,
} from "react-icons/md";
import { PiCow, PiFarmLight, PiPlus, PiWarehouse } from "react-icons/pi";
import { RiAlignItemLeftLine } from "react-icons/ri";
import { GiCage } from "react-icons/gi";
import { SiHappycow } from "react-icons/si";
import { FaWpforms } from "react-icons/fa";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { LuGitPullRequest, LuMilk } from "react-icons/lu";
import { BiCategory, BiTask, BiUser } from "react-icons/bi";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/Button/ButtonComponent";
import { breadcumData } from "../../service/data/breadcumData";
import LabelDashboard from "./components/LabelDashboard";
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
    label: <Link to={`/dairy/${key}`}>{label}</Link>,
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
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbItems = pathSegments.map((segment, index) => ({
    title:
      breadcumData[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1),
    href: "/" + pathSegments.slice(0, index + 1).join("/"),
  }));
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
  const sizeIcon = 15;

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
    {
      key: "user-group",
      label: <LabelDashboard>User Management</LabelDashboard>,
      type: "group",
      children: [
        getItem("User", "user-management", <BiUser />),
        getItem("Role", "role-management", <BiCategory />),
      ],
    },
    getItem("Dairy Management", "dairy-management", <PiFarmLight />),
    {
      key: "group-cow",
      label: <LabelDashboard>Dairy Management</LabelDashboard>,
      type: "group",
      children: [
        getItem("Cow", "cow-management", <PiCow />, [
          getItem("List Cow", "cow-management", <CiBoxList size={sizeIcon} />),
          getItem(
            "Cow Type",
            "cow-type-management",
            <BiCategory size={sizeIcon} />
          ),
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
        getItem("Feed", "feed-management", <MdOutlineFastfood />),
        getItem("Area", "area-management", <LiaChartAreaSolid />),
        getItem("Pen", "pen-management", <GiCage />),
        getItem("Milk", "milk-management", <LuMilk />),
        getItem("Warehouse", "warehouse-management", <PiWarehouse />, [
          getItem(
            "Category",
            "category-management",
            <BiCategory size={sizeIcon} />
          ),
          getItem(
            "Item",
            "item-management",
            <RiAlignItemLeftLine size={sizeIcon} />
          ),
          getItem(
            "Supplier",
            "supplier-management",
            <LiaProductHunt size={sizeIcon} />
          ),
        ]),
      ],
    },
    {
      key: "group-schedule",
      label: <LabelDashboard>HR Management</LabelDashboard>,
      type: "group",
      children: [
        getItem("Worker", "worker-management", <BiUser />),
        getItem("Schedule", "schedule-management", <MdSchedule />),
        getItem("Task", "task-management", <BiTask />, [
          getItem("Task Type", "task-type", <BiCategory size={sizeIcon} />),
        ]),
        getItem("Application", "application-management", <FaWpforms />),
        getItem("Issue", "issue-management", <AiOutlineIssuesClose />),
        getItem(
          "Request Schedule",
          "request-schedule-management",
          <LuGitPullRequest />
        ),
      ],
    },
  ];
  return (
    <Layout style={{ minHeight: "100vh" }} className="layout-dairy">
      <Sider
        trigger={null}
        collapsible
        width={270}
        style={siderStyle}
        className="sider-dairy bg-white border-r-2"
      >
        <div className="demo-logo-vertical" />
        <div className={`bg-white p-3 flex gap-4 justify-start items-center`}>
          <SiHappycow className="text-green-900" size={52} />
          <p className="text-2xl font-bold text-black">Dairy Farm</p>
        </div>
        <Divider className="!m-0 border-white" />
        <Menu
          theme="light"
          mode="inline"
          items={itemsMenu}
          className="menu-sider !text-base"
          selectedKeys={[location.pathname.slice(1)]} // Dynamically select menu item
        />
      </Sider>
      <Layout style={{ marginLeft: 270 }} className="duration-300">
        <Header
          className="!bg-white flex items-center gap-5 justify-end"
          style={{ padding: 0 }}
        >
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
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>
                <Link to="/">Home</Link>
              </Breadcrumb.Item>
              {breadcrumbItems.map((item, index) => (
                <Breadcrumb.Item key={index}>
                  <Link to={item.href}>{item.title}</Link>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppDashboard;

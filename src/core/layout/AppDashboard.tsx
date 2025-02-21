import { WalletOutlined } from '@ant-design/icons';
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
} from 'antd';

import React, { useEffect } from 'react';

import { AiOutlineDashboard, AiOutlineIssuesClose } from 'react-icons/ai';
import { BiCategory, BiTask, BiUser } from 'react-icons/bi';
import { CiBoxList, CiExport } from 'react-icons/ci';
import { FaWpforms } from 'react-icons/fa';
import { GiCage } from 'react-icons/gi';
import { IoIosLogOut, IoIosNotifications } from 'react-icons/io';
import { LiaChartAreaSolid, LiaProductHunt } from 'react-icons/lia';
import { LuGitPullRequest, LuMilk } from 'react-icons/lu';
import {
  MdOutlineFastfood,
  MdOutlineHealthAndSafety,
  MdOutlineVaccines,
  MdSchedule,
  MdSwapVert,
} from 'react-icons/md';
import { PiCow, PiPlus, PiWarehouse } from 'react-icons/pi';
import { RiAlignItemLeftLine } from 'react-icons/ri';
import { SiHappycow } from 'react-icons/si';
import { useDispatch } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import ButtonComponent from '../../components/Button/ButtonComponent';
import AnimationAppear from '../../components/UI/AnimationAppear';
import useFetcher from '../../hooks/useFetcher';
import useToast from '../../hooks/useToast';
import { breadcumData } from '../../service/data/breadcumData';
import { getAvatar } from '../../utils/getImage';
import { setAvatarFunction } from '../store/slice/avatarSlice';
import { logout } from '../store/slice/userSlice';
import LabelDashboard from './components/LabelDashboard';
import './index.scss';
import { useTranslation } from 'react-i18next';
const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];
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
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  zIndex: 1,
};

const AppDashboard: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const { data, mutate } = useFetcher<any>('users/profile', 'GET');

  useEffect(() => {
    if (data) {
      dispatch(setAvatarFunction(mutate));
    }
  }, []);

  const breadcrumbItems = pathSegments.map((segment, index) => ({
    title:
      breadcumData[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1),
    href: '/' + pathSegments.slice(0, index + 1).join('/'),
  }));
  const navigate = useNavigate();
  const toast = useToast();
  const { token } = useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };
  const sizeIcon = 15;

  const handleNavigate = (link: string) => navigate(link);

  const handleLogout = () => {
    dispatch(logout());
    toast.showSuccess('Login success');
    handleNavigate('/login');
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div
          className="flex flex-col"
          onClick={() => handleNavigate('profile')}
        >
          <p className="text-base font-bold">Nguyen Van A</p>
          <p className="text-slate-500">Staff</p>
        </div>
      ),
    },
  ];

  const itemsMenu: MenuItem[] = [
    {
      key: 'user-group',
      label: <LabelDashboard>{t('user_management')}</LabelDashboard>,

      type: 'group',
      children: [
        getItem(t('user'), 'dairy/user-management', <BiUser />),
        getItem(t('role'), 'dairy/role-management', <BiCategory />),
      ],
    },
    getItem(t('dashboard'), 'dairy/dashboard', <AiOutlineDashboard />, [
      getItem(t('daily_milk'), 'dairy/dashboard/daily-milk', <LuMilk />),
    ]),
    {
      key: 'group-cow',
      label: <LabelDashboard>{t('dairy_management')}</LabelDashboard>,
      type: 'group',
      children: [
        getItem(t('Cow'), 'dairy/cow-management', <PiCow />, [
          getItem(
            t('list_cow'),
            'dairy/cow-management/list-cow',
            <CiBoxList size={sizeIcon} />
          ),
          getItem(
            t('cow_type'),
            'dairy/cow-management/cow-type-management',
            <BiCategory size={sizeIcon} />
          ),
          getItem(
            t('create_cow'),
            'dairy/cow-management/create-cow',
            <PiPlus size={sizeIcon} />
          ),
          getItem(
            t('health_report'),
            'dairy/cow-management/health-report',
            <MdOutlineHealthAndSafety size={sizeIcon} />,
            [
              getItem(
                t('Illness'),
                'dairy/cow-management/health-report/ill-ness',
                <BiCategory size={sizeIcon} />
              ),
            ]
          ),
        ]),
        getItem(t('Feed'), 'dairy/feed-management', <MdOutlineFastfood />, [
          getItem(
            t('List'),
            'dairy/feed-management/list',
            <CiBoxList size={sizeIcon} />
          ),
          getItem(
            t('Create feed meal'),
            'dairy/feed-management/create-feed-meal',
            <PiPlus size={sizeIcon} />
          ),
        ]),
        getItem(t('Area'), 'dairy/area-management', <LiaChartAreaSolid />),
        getItem(t('Pen'), 'dairy/pen-management', <GiCage />),
        getItem(t('Move cow'), 'dairy/move-cow-management', <MdSwapVert />),
        getItem(t('Milk'), 'dairy/milk-management', <LuMilk />, [
          getItem(
            t('Milk batch'),
            'dairy/milk-management/milk-batch',
            <WalletOutlined size={sizeIcon} />
          ),
        ]),
        getItem(
          t('Vaccine cycle'),
          'dairy/vaccine-cycle-management',
          <MdOutlineVaccines />,
          [
            getItem(
              t('Vaccine cycle list'),
              'dairy/vaccine-cycle-management/list',
              <CiBoxList size={sizeIcon} />
            ),
          ]
        ),
        getItem(t('warehouse'), 'dairy/warehouse-management', <PiWarehouse />, [
          getItem(
            t('warehouse'),
            'dairy/warehouse-management/warehouse',
            <PiWarehouse size={sizeIcon} />
          ),
          getItem(
            t('Category'),
            'dairy/warehouse-management/category',
            <BiCategory size={sizeIcon} />
          ),
          getItem(
            t('Item'),
            'dairy/warehouse-management/item-management',
            <RiAlignItemLeftLine size={sizeIcon} />,
            [
              getItem(
                t('Item list'),
                'dairy/warehouse-management/item-management',
                <CiBoxList size={sizeIcon} />
              ),
              getItem(
                t('Item batch'),
                'dairy/warehouse-management/item-management/item-batch',
                <BiCategory size={sizeIcon} />
              ),
              getItem(
                t('Export item'),
                'dairy/warehouse-management/item-management/export-item',
                <CiExport size={sizeIcon} />
              ),
            ]
          ),
          getItem(
            t('Supplier'),
            'dairy/warehouse-management/supplier',
            <LiaProductHunt size={sizeIcon} />
          ),
        ]),
      ],
    },
    {
      key: 'group-schedule',
      label: <LabelDashboard>{t('hr_management')}</LabelDashboard>,
      type: 'group',
      children: [
        getItem(t('Human'), 'dairy/human-management', <BiUser />, [
          getItem(
            t('Worker'),
            'dairy/human-management/worker',
            <CiBoxList size={sizeIcon} />
          ),
          getItem(
            t('Veterinarians'),
            'dairy/human-management/veterinarian',
            <CiBoxList size={sizeIcon} />
          ),
        ]),

        getItem(t('Schedule'), 'dairy/schedule-management', <MdSchedule />),
        getItem(t('Task'), 'dairy/task-management', <BiTask />, [
          getItem(
            t('Task type'),
            'dairy/task-type',
            <BiCategory size={sizeIcon} />
          ),
        ]),
        getItem(
          t('application'),
          'dairy/application-management',
          <FaWpforms />
        ),
        getItem(t('Issue'), 'dairy/issue-management', <AiOutlineIssuesClose />),
        getItem(
          t('Request schedule'),
          'dairy/request-schedule-management',
          <LuGitPullRequest />
        ),
      ],
    },
  ];
  return (
    <AnimationAppear>
      <Layout style={{ minHeight: '100vh' }} className="layout-dairy">
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
                    trigger={['click']}
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
                            onClick={handleLogout}
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
                    <Avatar size={32} src={getAvatar(data?.profilePhoto)} />
                  </Dropdown>
                </ConfigProvider>
              </div>
            </div>
          </Header>
          <Content
            style={{ padding: '10px' }}
            className=" !bg-slate-200 !min-h-[90vh]"
          >
            <div
              style={{
                padding: 8,
                minHeight: 360,
                overflowY: 'auto',
              }}
              className="!h-full"
            >
              <Breadcrumb style={{ margin: '16px 0' }}>
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
    </AnimationAppear>
  );
};

export default AppDashboard;

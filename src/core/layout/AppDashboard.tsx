import { WalletOutlined } from '@ant-design/icons';
import {
  Avatar,
  ConfigProvider,
  Divider,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  theme,
  Tooltip,
} from 'antd';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import ButtonComponent from '@components/Button/ButtonComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import { triggerAvatarRefresh } from '@core/store/slice/avatarSlice';
import { logout } from '@core/store/slice/userSlice';
import { RootState } from '@core/store/store';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { UserProfileData } from '@model/User';
import { USER_PATH } from '@service/api/User/userApi';
import { requestFCMToken } from '@utils/firebase';
import { getAvatar } from '@utils/getImage';
import { useTranslation } from 'react-i18next';
import { AiOutlineImport, AiTwotoneTool } from 'react-icons/ai';
import { BiCategory, BiTask, BiUser } from 'react-icons/bi';
import { CiBoxList, CiExport } from 'react-icons/ci';
import { FaWarehouse, FaWpforms } from 'react-icons/fa';
import { HiOutlineBell } from 'react-icons/hi';
import { IoIosLogOut } from 'react-icons/io';
import { LiaChartAreaSolid, LiaProductHunt } from 'react-icons/lia';
import { LuMilk } from 'react-icons/lu';
import {
  MdOutlineFastfood,
  MdOutlineHealthAndSafety,
  MdOutlineVaccines,
} from 'react-icons/md';
import {
  PiCow,
  PiFarmFill,
  PiPlus,
  PiUserListFill,
  PiWarehouse,
} from 'react-icons/pi';
import { RiAccountPinCircleFill, RiAlignItemLeftLine } from 'react-icons/ri';
import { SiHappycow } from 'react-icons/si';
import { TbDashboardFilled } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import LabelDashboard from './components/LabelDashboard';
import NotificationDropDown from './components/NotificationDropDown';
import './index.scss';
import { BsTools } from 'react-icons/bs';
const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];
const { useToken } = theme;

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  disabledClick: boolean = false
): MenuItem {
  const tooltipContent = typeof label === 'string' ? label : undefined;

  const itemContent = disabledClick ? (
    <LabelDashboard>
      {typeof label === 'string' && label.length > 20
        ? `${label.slice(0, 20)}...`
        : label}
    </LabelDashboard>
  ) : (
    <Link className="!w-full" to={`/${key}`}>
      {typeof label === 'string' && label.length > 20
        ? `${label.slice(0, 20)}...`
        : label}
    </Link>
  );

  return {
    key,
    icon,
    children,
    label: (
      <Tooltip
        arrow
        placement="right"
        title={tooltipContent}
        overlayClassName="menu-item-tooltip"
        // optional: add delay
        // mouseEnterDelay={0.5}
      >
        <div className="w-full flex items-center">{itemContent}</div>
      </Tooltip>
    ),
    title: tooltipContent,
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

const checkVeterinarians = (role: string) => {
  return role === 'Veterinarians';
};

const checkManager = (role: string) => {
  return role === 'Manager';
};

const AppDashboard: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedKey = location.pathname.replace(/^\//, ''); // Lấy path và bỏ dấu '/'
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { data, mutate } = useFetcher<UserProfileData>('users/profile', 'GET');
  const { roleName } = useSelector((state: RootState) => state.user);
  const { trigger: triggerFCM } = useFetcher(USER_PATH.FCM_TOKEN_UPDATE, 'PUT');
  const shouldRefreshAvatar = useSelector(
    (state: RootState) => state.avatar.shouldRefreshAvatar
  );

  useEffect(() => {
    const fetchToken = async () => {
      const fcmToken = await requestFCMToken().then((element) => element);
      await triggerFCM({ body: { fcmTokenWeb: fcmToken } });
    };
    fetchToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shouldRefreshAvatar === true) {
      mutate();
      dispatch(triggerAvatarRefresh(false));
    }
  }, [dispatch, mutate, shouldRefreshAvatar]);

  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const parentPaths = pathSegments.map((_, index) =>
      pathSegments.slice(0, index + 1).join('/')
    );
    setOpenKeys((prevKeys) =>
      Array.from(new Set([...prevKeys, ...parentPaths]))
    );
  }, [location.pathname]);

  const handleOpenChange = useCallback((keys: string[]) => {
    setOpenKeys((prevKeys) => {
      const latestKey = keys.find((key) => !prevKeys.includes(key));
      return latestKey ? [...prevKeys, latestKey] : keys;
    });
  }, []);

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
  const sizeIcon = 20;

  const handleLogout = useCallback(() => {
    dispatch(logout());
    toast.showSuccess(t('Logout success'));
    navigate('/login');
  }, [dispatch, toast, t, navigate]);
  const items = useMemo(
    () => [
      {
        key: '1',
        label: (
          <div className="flex flex-col" onClick={() => navigate('profile')}>
            <p className="text-base font-bold">{data?.name}</p>
            <p className="text-slate-500">{t(data?.roleId?.name || '')}</p>
          </div>
        ),
      },
    ],
    [data, t, navigate]
  );

  const itemsMenu: MenuItem[] = [
    checkVeterinarians(roleName)
      ? null
      : getItem(
          t('dashboard'),
          'dairy/dashboard',
          <TbDashboardFilled size={sizeIcon} />,
          [
            !checkVeterinarians(roleName)
              ? getItem(
                  t('Dashboard'),
                  'dairy/dashboard/total',
                  <TbDashboardFilled size={sizeIcon} />
                )
              : null,
            getItem(
              t('daily_milk'),
              'dairy/dashboard/daily-milk',
              <LuMilk size={sizeIcon} />
            ),
          ],
          true
        ),
    checkVeterinarians(roleName) || roleName === 'Manager'
      ? null
      : getItem(
          t('user_management'),
          'user-group',
          <PiUserListFill size={sizeIcon} color="black" />,
          [
            getItem(
              t('user_management'),
              'dairy/user-management',
              <BiUser size={sizeIcon} />
            ),
            getItem(
              t('Role management'),
              'dairy/role-management',
              <BiCategory size={sizeIcon} />
            ),
          ],
          true
        ),
    getItem(
      t('dairy_management'),
      'group-cow',
      <PiFarmFill size={sizeIcon} />,
      [
        getItem(
          t('Cow management'),
          'dairy/cow-management',
          <PiCow size={sizeIcon} />,
          [
            getItem(
              t('List'),
              'dairy/cow-management/list-cow',
              <CiBoxList size={sizeIcon} />
            ),
            getItem(
              t('cow_type'),
              'dairy/cow-management/cow-type-management',
              <BiCategory size={sizeIcon} />
            ),
            checkVeterinarians(roleName)
              ? null
              : getItem(
                  t('create_cow'),
                  'dairy/cow-management/create-cow',
                  <PiPlus size={sizeIcon} />
                ),
            checkVeterinarians(roleName)
              ? null
              : getItem(
                  t('Import cow'),
                  'dairy/cow-management/import-cow',
                  <AiOutlineImport size={sizeIcon} />
                ),
            getItem(
              t('health_report'),
              'dairy/cow-management/health-report',
              <MdOutlineHealthAndSafety size={sizeIcon} />,
              [
                getItem(
                  t('Illness'),
                  'dairy/cow-management/health-report/illness',
                  <BiCategory size={sizeIcon} />
                ),
              ]
            ),
          ]
        ),
        getItem(
          t('Feed management'),
          'dairy/feed-management',
          <MdOutlineFastfood size={sizeIcon} />,
          [
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
          ]
        ),
        getItem(
          t('Vaccine management'),
          'dairy/vaccine-cycle-management',
          <MdOutlineVaccines size={sizeIcon} />,
          [
            getItem(
              t('Vaccine cycle list'),
              'dairy/vaccine-cycle-management/list',
              <CiBoxList size={sizeIcon} />
            ),
            getItem(
              t('Vaccine injection list'),
              'dairy/vaccine-cycle-management/vaccine-injection-list',
              <CiBoxList size={sizeIcon} />
            ),
          ]
        ),
        getItem(
          t('Area & Pen Management'),
          'dairy/area-management',
          <LiaChartAreaSolid size={sizeIcon} />
        ),
      ],
      true
    ),
    checkVeterinarians(roleName)
      ? null
      : getItem(
          t('Warehouse management'),
          'dairy/warehouse',
          <FaWarehouse size={sizeIcon} />,
          [
            getItem(
              t('Milk management'),
              'dairy/milk-management',
              <LuMilk size={sizeIcon} />,
              [
                getItem(
                  t('Milk batch'),
                  'dairy/milk-management/milk-batch',
                  <WalletOutlined size={sizeIcon} />
                ),
              ]
            ),
            getItem(
              t('Storage management'),
              'dairy/warehouse-management',
              <PiWarehouse size={sizeIcon} />,
              [
                getItem(
                  t('Storage'),
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
                      t('List'),
                      'dairy/warehouse-management/item-management/list',
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
                getItem(
                  t('Equipment'),
                  'dairy/warehouse-management/equipment',
                  <AiTwotoneTool size={sizeIcon} />
                ),
              ]
            ),
          ],
          true
        ),
    checkVeterinarians(roleName)
      ? {
          key: 'group-vet-schedule',
          label: <LabelDashboard>{t('Schedule management')}</LabelDashboard>,
          type: 'group',
          children: [
            getItem(
              t('My task'),
              'dairy/task-management/my-task',
              <CiBoxList size={sizeIcon} />
            ),
          ],
        }
      : getItem(
          t('HR management'),
          'group-schedule',
          <RiAccountPinCircleFill size={sizeIcon} color="black" />,
          [
            getItem(
              t('Human management'),
              'dairy/human-management',
              <BiUser size={sizeIcon} />,
              [
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
              ]
            ),
            getItem(
              t('Task management'),
              'dairy/task-management',
              <BiTask size={sizeIcon} />,
              [
                !checkManager(roleName)
                  ? null
                  : getItem(
                      t('Task'),
                      'dairy/task-management/list',
                      <CiBoxList size={sizeIcon} />
                    ),
                !checkManager(roleName)
                  ? null
                  : getItem(
                      t('Import task'),
                      'dairy/task-management/import',
                      <AiOutlineImport size={sizeIcon} />
                    ),
                !checkManager(roleName)
                  ? null
                  : getItem(
                      t('Task type'),
                      'dairy/task-management/task-type',
                      <BiCategory size={sizeIcon} />,
                      [
                        getItem(
                          t('List'),
                          'dairy/task-management/task-type/list',
                          <CiBoxList />
                        ),
                        getItem(
                          t('Equipment Required'),
                          'dairy/task-management/task-type/use-equipment',
                          <BsTools />
                        ),
                      ]
                    ),
              ]
            ),

            !checkManager(roleName)
              ? null
              : getItem(
                  t('Application management'),
                  'dairy/application-management',
                  <FaWpforms size={sizeIcon} />,
                  [
                    getItem(
                      t('Application'),
                      'dairy/application-management/application',
                      <CiBoxList size={sizeIcon} />
                    ),
                    getItem(
                      t('Application Type'),
                      'dairy/application-management/application-type',
                      <BiCategory size={sizeIcon} />
                    ),
                  ]
                ),
            // getItem(
            //   t('Issue management'),
            //   'dairy/issue-management',
            //   <AiOutlineIssuesClose />
            // ),
            checkManager(roleName)
              ? getItem(
                  t('Notification management'),
                  'dairy/notification-management',
                  <HiOutlineBell size={sizeIcon} />
                )
              : null,
            // getItem(
            //   t('Request schedule'),
            //   'dairy/request-schedule-management',
            //   <LuGitPullRequest />
            // ),
          ],
          true
        ),
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
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemMarginBlock: 5,
                },
              },
            }}
          >
            <Menu
              theme="light"
              items={itemsMenu}
              className="menu-sider !text-base"
              selectedKeys={[selectedKey]}
              openKeys={openKeys}
              mode="inline"
              onOpenChange={handleOpenChange}
            />
          </ConfigProvider>
        </Sider>
        <Layout style={{ marginLeft: 270 }} className="duration-300">
          <Header
            className="!bg-white flex items-center gap-5 justify-end"
            style={{ padding: 0 }}
          >
            {roleName !== 'Admin' && (
              <div className="flex items-center gap-5 pr-16">
                <NotificationDropDown />
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
                              {t('Logout')}
                            </ButtonComponent>
                          </div>
                        </div>
                      )}
                    >
                      <Avatar
                        size={32}
                        src={getAvatar(data?.profilePhoto as string)}
                      />
                    </Dropdown>
                  </ConfigProvider>
                </div>
              </div>
            )}
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
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </AnimationAppear>
  );
});

export default AppDashboard;

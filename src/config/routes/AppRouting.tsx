import { RootState } from '@core/store/store';
import { Spin } from 'antd';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { SiHappycow } from 'react-icons/si';
import TaskTypeManagement from '@pages/TaskManagement/TaskType';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import DetailWarehouse from '@pages/WarehouseManagement/components/Warehouse/components/DetailWarehouse';
const EquipmentRequired = lazy(
  () => import('@pages/TaskManagement/TaskType/EquipmentRequired')
);
const ApplicationType = lazy(
  () => import('@pages/ApplicationManagement/ApplicationType')
);
const ErrorPageNotification = lazy(() => import('@pages/Error'));
const ListNotification = lazy(
  () => import('@pages/NotificationManagement/components/List/ListNotification')
);
const TaskManagement = lazy(() => import('@pages/TaskManagement'));
const TaskType = lazy(
  () => import('@pages/TaskManagement/TaskType/ListTaskType')
);
const Equipment = lazy(
  () => import('@pages/WarehouseManagement/components/Equipment')
);
const ListVaccineInjection = lazy(
  () => import('@pages/VaccineCycleManagement/components/ListVaccineInjection')
);
const ApplicationListing = lazy(
  () => import('@pages/ApplicationManagement/Application-management')
);
const ListCowImport = lazy(
  () => import('@pages/CowManagement/components/ImportCow')
);
const AuthCallback = lazy(() => import('@pages/Login/components/AuthCallback'));
const DashboardToday = lazy(
  () => import('@pages/Dashboard/components/DashboardToday')
);
const ApplicationManagement = lazy(
  () => import('@pages/ApplicationManagement')
);
const ImportTask = lazy(
  () => import('@pages/TaskManagement/ImportTask/ImportTask')
);
const NotificationManagement = lazy(
  () => import('@pages/NotificationManagement')
);
const DetailTask = lazy(
  () => import('@pages/TaskManagement/DetailTask/DetailTask')
);
const MyTaskSchedule = lazy(
  () => import('@pages/TaskManagement/MyTaskSchedule/MyTaskSchedule')
);
const TaskSchedule = lazy(
  () => import('@pages/TaskManagement/TaskSchedule/TaskSchedule')
);
const AreaDetail = lazy(
  () => import('@pages/AreaManagement/components/AreaDetail/AreaDetail')
);
const AreaAndPenTab = lazy(
  () => import('@pages/AreaManagement/components/index')
);
const DetailFeedMeal = lazy(
  () => import('@pages/FeedManagement/FeedMeal/components/DetailFeedMeal')
);
const FeedMealList = lazy(
  () => import('@pages/FeedManagement/FeedMeal/components/List/FeedMealList')
);

const CreateFeedMeal = lazy(
  () => import('@pages/FeedManagement/FeedMeal/components/CreateFeedMeal')
);

const ListItemBatch = lazy(
  () =>
    import(
      '@pages/WarehouseManagement/components/Item/components/ItemBatch/components/ListItemBatch'
    )
);
const DetailItemBatch = lazy(
  () =>
    import(
      '@pages/WarehouseManagement/components/Item/components/ItemBatch/components/DetailItemBatch'
    )
);
const ExportItem = lazy(
  () =>
    import('@pages/WarehouseManagement/components/Item/components/ExportItem')
);
const ListExports = lazy(
  () =>
    import(
      '@pages/WarehouseManagement/components/Item/components/ExportItem/ListExports'
    )
);
const DetailExport = lazy(
  () =>
    import(
      '@pages/WarehouseManagement/components/Item/components/ExportItem/DetailExport'
    )
);
const MilkManagement = lazy(() => import('@pages/MilkManagement'));
const MilkBatchManagement = lazy(
  () => import('@pages/MilkManagement/MilkBatchManagement')
);
const HumanManagement = lazy(() => import('@pages/HumanManangement'));
const ListWorker = lazy(
  () => import('@pages/HumanManangement/WorkerManagement')
);
const ListVeterinarian = lazy(
  () => import('@pages/HumanManangement/VeterinarianManagement')
);

// Lazy load components
const ItemDetail = lazy(
  () =>
    import('@pages/WarehouseManagement/components/Item/components/ItemDetail')
);
const ItemBatchManagement = lazy(
  () =>
    import('@pages/WarehouseManagement/components/Item/components/ItemBatch')
);
const AppDashboard = lazy(() => import('@core/layout/AppDashboard'));
const CowManagement = lazy(() => import('@pages/CowManagement'));
const ListCow = lazy(() => import('@pages/CowManagement/components/ListCow'));
const AreaAndPenManagement = lazy(() => import('@pages/AreaManagement'));
const CowTypeManagement = lazy(
  () => import('@pages/CowManagement/components/CowTypeManagement')
);
const CreateCow = lazy(
  () => import('@pages/CowManagement/components/CreateCow')
);
const LoginPage = lazy(() => import('@pages/Login'));
const ForgetPassword = lazy(
  () => import('@pages/Login/components/ForgetPassword')
);
const LoginForm = lazy(() => import('@pages/Login/components/LoginForm'));
const Profile = lazy(() => import('@pages/Profile'));
const ListRole = lazy(() => import('@pages/RoleManagement'));
const ListUser = lazy(() => import('@pages/UserManagement'));
const Dashboard = lazy(() => import('@pages/Dashboard'));
const DailyMilkDashboard = lazy(
  () => import('@pages/Dashboard/components/DailyMilk')
);
const CowDetail = lazy(
  () => import('@pages/CowManagement/components/CowDetail')
);
const FeedMealManagement = lazy(() => import('@pages/FeedManagement/FeedMeal'));
const VaccineCycleManagement = lazy(
  () => import('@pages/VaccineCycleManagement')
);
const ListVaccineCycle = lazy(
  () => import('@pages/VaccineCycleManagement/components/ListVaccineCycle')
);
const DetailVaccineCycle = lazy(
  () => import('@pages/VaccineCycleManagement/components/DetailVaccineCycle')
);
const DetailVaccineInjection = lazy(
  () =>
    import(
      '@pages/VaccineCycleManagement/components/ListVaccineInjection/components/DetailVaccineInjection'
    )
);
const WarehouseManagement = lazy(() => import('@pages/WarehouseManagement'));
const Category = lazy(
  () => import('@pages/WarehouseManagement/components/Category')
);
const ItemManagement = lazy(
  () => import('@pages/WarehouseManagement/components/Item')
);
const ListItemManagement = lazy(
  () => import('@pages/WarehouseManagement/components/Item/components/ListItem')
);
const Warehouse = lazy(
  () => import('@pages/WarehouseManagement/components/Warehouse')
);
const Supplier = lazy(
  () => import('@pages/WarehouseManagement/components/Supplier')
);
const HealthReport = lazy(
  () => import('@pages/CowManagement/components/HeathReport')
);
const IllNess = lazy(
  () => import('@pages/CowManagement/components/HeathReport/IllNess')
);
// Add more components as needed...

const SuspenseWrapper = (Component: JSX.Element, delay = 500) => {
  const Wrapper = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
      const timeout = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timeout);
    }, []);

    if (!show) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Spin size="large" />
        </div>
      );
    }

    return (
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Spin size="large" />
          </div>
        }
      >
        {Component}
      </Suspense>
    );
  };

  return <Wrapper />;
};

const AppRouting = () => {
  const user = useSelector((state: RootState) => state.user);

  const AppWrapper = (Component: JSX.Element) => (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex flex-col justify-center items-center">
          <div
            className={`bg-white p-3 flex  gap-4 justify-center items-center`}
          >
            <SiHappycow className="text-green-900" size={52} />
            <p className="text-2xl font-bold text-black">Dairy Farm</p>
          </div>
          <Spin size="large" />
        </div>
      }
    >
      {Component}
    </Suspense>
  );

  const router = createBrowserRouter([
    {
      path: '',
      element: <Navigate to={user.userId !== 0 ? '/dairy' : '/login'} />,
    },
    {
      path: '/login',
      element: AppWrapper(<LoginPage />),
      children: [
        {
          path: '',
          index: true,
          element: SuspenseWrapper(<LoginForm />),
        },
        {
          path: 'forget-password',
          element: SuspenseWrapper(<ForgetPassword />),
        },
        {
          path: 'oauth2/callback',
          element: SuspenseWrapper(<AuthCallback />),
        },
      ],
    },
    {
      path: 'dairy',
      element:
        user.userId !== 0 ? (
          AppWrapper(<AppDashboard />)
        ) : (
          <Navigate to={'/login'} />
        ),
      children: [
        {
          path: '',
          element: (
            <Navigate
              to={
                user.roleName === 'Veterinarians'
                  ? 'profile'
                  : 'dashboard/total'
              }
            />
          ),
        },
        {
          path: 'user-management',
          element: (
            <ProtectedRoute allowedRoles={['Admin']} userRole={user.roleName}>
              {SuspenseWrapper(<ListUser />)}
            </ProtectedRoute>
          ),
        },
        {
          path: 'role-management',
          element: (
            <ProtectedRoute allowedRoles={['Admin']} userRole={user.roleName}>
              {SuspenseWrapper(<ListRole />)}
            </ProtectedRoute>
          ),
        },

        {
          path: 'dashboard',
          element: (
            <ProtectedRoute
              allowedRoles={['Admin', 'Manager']}
              userRole={user.roleName}
            >
              {SuspenseWrapper(<Dashboard />)}
            </ProtectedRoute>
          ),
          children: [
            {
              path: '',
              element: <Navigate to={'total'} />,
            },
            {
              path: 'daily-milk',
              element: SuspenseWrapper(<DailyMilkDashboard />),
            },
            {
              path: 'total',
              element: SuspenseWrapper(<DashboardToday />),
            },
          ],
        },
        {
          path: 'cow-management',
          element: SuspenseWrapper(<CowManagement />),
          children: [
            {
              path: '',
              element: <Navigate to={'list-cow'} />,
            },
            {
              path: ':id',
              element: SuspenseWrapper(<CowDetail />),
            },
            {
              path: 'cow-type-management',
              element: SuspenseWrapper(<CowTypeManagement />),
            },
            {
              path: 'list-cow',
              element: SuspenseWrapper(<ListCow />),
            },
            {
              path: 'create-cow',
              element: (
                <ProtectedRoute
                  allowedRoles={['Admin', 'Manager']}
                  userRole={user.roleName}
                >
                  {SuspenseWrapper(<CreateCow />)}
                </ProtectedRoute>
              ),
            },
            {
              path: 'import-cow',
              element: (
                <ProtectedRoute
                  allowedRoles={['Admin', 'Manager']}
                  userRole={user.roleName}
                >
                  {SuspenseWrapper(<ListCowImport />)}
                </ProtectedRoute>
              ),
            },
            {
              path: 'health-report',
              element: SuspenseWrapper(<HealthReport />),
              children: [
                {
                  path: '',
                  element: <Navigate to={'illness'} />,
                },
                {
                  path: 'illness',
                  element: SuspenseWrapper(<IllNess />),
                },
              ],
            },
          ],
        },
        {
          path: 'feed-management',
          element: SuspenseWrapper(<FeedMealManagement />),
          children: [
            {
              path: '',
              element: <Navigate to={'list'} />,
            },
            {
              path: 'list',
              element: SuspenseWrapper(<FeedMealList />),
            },
            {
              path: 'create-feed-meal',
              element: SuspenseWrapper(<CreateFeedMeal />),
            },
            {
              path: ':id',
              element: SuspenseWrapper(<DetailFeedMeal />),
            },
          ],
        },
        {
          path: 'area-management',
          element: SuspenseWrapper(<AreaAndPenManagement />),
          children: [
            { path: '', element: SuspenseWrapper(<AreaAndPenTab />) },
            { path: ':id', element: SuspenseWrapper(<AreaDetail />) },
          ],
        },
        {
          path: 'warehouse-management',
          element: (
            <ProtectedRoute
              allowedRoles={['Manager', 'Admin']}
              userRole={user.roleName}
            >
              {SuspenseWrapper(<WarehouseManagement />)}
            </ProtectedRoute>
          ),
          children: [
            {
              path: '',
              element: <Navigate to={'warehouse'} />,
            },
            {
              path: 'warehouse',
              element: SuspenseWrapper(<Warehouse />),
            },
            {
              path: 'warehouse/:id',
              element: SuspenseWrapper(<DetailWarehouse />),
            },
            {
              path: 'category',
              element: SuspenseWrapper(<Category />),
            },
            {
              path: 'supplier',
              element: SuspenseWrapper(<Supplier />),
            },
            {
              path: 'equipment',
              element: SuspenseWrapper(<Equipment />),
            },
            {
              path: 'item-management',
              element: SuspenseWrapper(<ItemManagement />),
              children: [
                {
                  path: '',
                  element: <Navigate to={'list'} />,
                },
                {
                  path: 'list',
                  element: SuspenseWrapper(<ListItemManagement />),
                },
                {
                  path: ':id',
                  element: SuspenseWrapper(<ItemDetail />),
                },
                {
                  path: 'item-batch',
                  element: SuspenseWrapper(<ItemBatchManagement />),
                  children: [
                    {
                      path: '',
                      element: SuspenseWrapper(<ListItemBatch />),
                    },
                    {
                      path: ':id',
                      element: SuspenseWrapper(<DetailItemBatch />),
                    },
                  ],
                },
                {
                  path: 'export-item',
                  element: SuspenseWrapper(<ExportItem />),
                  children: [
                    {
                      path: '',
                      element: SuspenseWrapper(<ListExports />),
                    },
                    {
                      path: ':id',
                      element: SuspenseWrapper(<DetailExport />),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: 'vaccine-cycle-management',
          element: SuspenseWrapper(<VaccineCycleManagement />),
          children: [
            { path: '', element: <Navigate to={'list'} /> },
            { path: 'list', element: SuspenseWrapper(<ListVaccineCycle />) },
            {
              path: ':id',
              element: SuspenseWrapper(<DetailVaccineCycle />),
            },
            {
              path: 'vaccine-injection-list',
              element: SuspenseWrapper(<ListVaccineInjection />),
            },
            {
              path: 'injection/:id',
              element: SuspenseWrapper(<DetailVaccineInjection />),
            },
          ],
        },
        {
          path: 'milk-management',
          element: SuspenseWrapper(<MilkManagement />),
          children: [
            {
              path: '',
              element: <Navigate to={'milk-batch'} />,
            },

            {
              path: ':id',
              element: SuspenseWrapper(<MilkBatchManagement />),
            },
          ],
        },
        {
          path: 'human-management',
          element: (
            <ProtectedRoute
              allowedRoles={['Manager', 'Admin']}
              userRole={user.roleName}
            >
              {SuspenseWrapper(<HumanManagement />)}
            </ProtectedRoute>
          ),
          children: [
            {
              path: '',
              element: <Navigate to={'worker'} />,
            },

            {
              path: 'worker',
              element: SuspenseWrapper(<ListWorker />),
            },
            {
              path: 'veterinarian',
              element: SuspenseWrapper(<ListVeterinarian />),
            },
          ],
        },
        {
          path: 'task-management',
          element: SuspenseWrapper(<TaskManagement />),
          children: [
            {
              path: '',
              element: <Navigate to={'list'} />,
            },
            {
              path: 'my-task',
              element: (
                <ProtectedRoute
                  allowedRoles={['Veterinarians']}
                  userRole={user.roleName}
                >
                  {SuspenseWrapper(<MyTaskSchedule />)}
                </ProtectedRoute>
              ),
            },
            {
              path: 'list',
              element: (
                <ProtectedRoute
                  allowedRoles={['Manager', 'Admin']}
                  userRole={user.roleName}
                >
                  {SuspenseWrapper(<TaskSchedule />)}
                </ProtectedRoute>
              ),
            },
            {
              path: 'task-type',
              element: (
                <ProtectedRoute
                  allowedRoles={['Manager', 'Admin']}
                  userRole={user.roleName}
                >
                  {SuspenseWrapper(<TaskTypeManagement />)}
                </ProtectedRoute>
              ),
              children: [
                {
                  path: '',
                  element: <Navigate to={'list'} />,
                },
                {
                  path: 'list',
                  element: SuspenseWrapper(<TaskType />),
                },
                {
                  path: 'use-equipment',
                  element: SuspenseWrapper(<EquipmentRequired />),
                },
              ],
            },
            {
              path: 'my-task/:taskId',
              element: (
                <ProtectedRoute
                  allowedRoles={['Veterinarians']}
                  userRole={user.roleName}
                >
                  <Navigate to={'../my-task'} />
                </ProtectedRoute>
              ),
            },
            {
              path: 'my-task/:taskId/:day',
              element: (
                <ProtectedRoute
                  allowedRoles={['Veterinarians']}
                  userRole={user.roleName}
                >
                  {SuspenseWrapper(<DetailTask />)}
                </ProtectedRoute>
              ),
            },
            {
              path: ':taskId/:day',
              element: (
                <ProtectedRoute
                  allowedRoles={['Manager', 'Admin']}
                  userRole={user.roleName}
                >
                  {SuspenseWrapper(<DetailTask />)}
                </ProtectedRoute>
              ),
            },
            {
              path: ':taskId',
              element: (
                <ProtectedRoute
                  allowedRoles={['Manager', 'Admin']}
                  userRole={user.roleName}
                >
                  <Navigate to={'../list'} />
                </ProtectedRoute>
              ),
            },
            {
              path: 'import',
              element: (
                <ProtectedRoute
                  allowedRoles={['Manager', 'Admin']}
                  userRole={user.roleName}
                >
                  {SuspenseWrapper(<ImportTask />)}
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: 'application-management',
          element: (
            <ProtectedRoute
              allowedRoles={['Manager', 'Admin']}
              userRole={user.roleName}
            >
              {SuspenseWrapper(<ApplicationManagement />)}
            </ProtectedRoute>
          ),
          children: [
            {
              path: '',
              element: <Navigate to={'application'} />,
            },

            {
              path: 'application',
              element: SuspenseWrapper(<ApplicationListing />),
            },
            {
              path: 'application-type',
              element: SuspenseWrapper(<ApplicationType />),
            },
          ],
        },
        {
          path: 'notification-management',
          element: (
            <ProtectedRoute
              allowedRoles={['Manager', 'Admin']}
              userRole={user.roleName}
            >
              {SuspenseWrapper(<NotificationManagement />)}
            </ProtectedRoute>
          ),
          children: [
            {
              path: '',
              element: <Navigate to="list" />,
            },
            {
              path: 'list',
              element: SuspenseWrapper(<ListNotification />),
            },
          ],
        },
        {
          path: 'profile',
          element: SuspenseWrapper(<Profile />),
        },
      ],
    },
    {
      path: '*',
      element: <ErrorPageNotification />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRouting;

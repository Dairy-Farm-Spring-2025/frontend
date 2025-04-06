import { RootState } from '@core/store/store';
import { CowPenManagement } from '@pages/CowPenManagement';
import { MoveCowManagement } from '@pages/CowPenManagement/components/MoveCowManagement';
import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import ApplicationManagement from '@pages/ApplicationManagement';
import ApplicationType from '@pages/ApplicationManagement/ApplicationType';
import ErrorPageNotification from '@pages/Error';
import TaskManagement from '@pages/TaskManagement';
import TaskType from '@pages/TaskManagement/TaskType';
import Equipment from '@pages/WarehouseManagement/components/Equipment';
import { SiHappycow } from 'react-icons/si';
import ListNotification from '@pages/NotificationManagement/components/List/ListNotification';

import ListVaccineInjection from '@pages/VaccineCycleManagement/components/ListVaccineInjection';

import AuthCallback from '@pages/Login/components/AuthCallback';
import ImportCow from '@pages/CowManagement/components/ImportCow/components/ImportCow';
import ListCowImport from '@pages/CowManagement/components/ImportCow';
import ApplicationListing from '@pages/ApplicationManagement/Application-management';

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
const PenManageMent = lazy(() => import('@pages/PenManagement'));
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

const AppRouting = () => {
  const user = useSelector((state: RootState) => state.user);
  console.log(user);
  const SuspenseWrapper = (Component: JSX.Element) => (
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
          path: 'user-management',
          element: SuspenseWrapper(<ListUser />),
        },
        {
          path: 'role-management',
          element: SuspenseWrapper(<ListRole />),
        },

        {
          path: 'dashboard',
          element: SuspenseWrapper(<Dashboard />),
          children: [
            {
              path: '',
              element: <Navigate to={'daily-milk'} />,
            },
            {
              path: 'daily-milk',
              element: SuspenseWrapper(<DailyMilkDashboard />),
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
              element: SuspenseWrapper(<CreateCow />),
            },
            {
              path: 'import-cow',
              element: SuspenseWrapper(<ListCowImport />),
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
          element: SuspenseWrapper(<WarehouseManagement />),
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
          path: 'pen-management',
          element: SuspenseWrapper(<PenManageMent />),
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
          path: 'move-cow-management',
          element: SuspenseWrapper(<CowPenManagement />),
          children: [
            {
              path: '',
              element: SuspenseWrapper(<MoveCowManagement />),
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
          element: SuspenseWrapper(<HumanManagement />),
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
              element: SuspenseWrapper(<MyTaskSchedule />),
            },
            {
              path: 'list',
              element: SuspenseWrapper(<TaskSchedule />),
            },
            {
              path: 'task-type',
              element: SuspenseWrapper(<TaskType />),
            },
            {
              path: 'my-task/:taskId',
              element: <Navigate to={'../my-task'} />,
            },
            {
              path: 'my-task/:taskId/:day',
              element: SuspenseWrapper(<DetailTask />),
            },
            {
              path: ':taskId/:day',
              element: SuspenseWrapper(<DetailTask />),
            },
            {
              path: ':taskId',
              element: <Navigate to={'../list'} />,
            },
          ],
        },
        {
          path: 'application-management',
          element: SuspenseWrapper(<ApplicationManagement />),
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
          element: SuspenseWrapper(<NotificationManagement />),
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

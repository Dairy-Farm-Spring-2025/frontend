import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { RootState } from '@core/store/store';
import { CowPenManagement } from '@pages/CowPenManagement';
import { MoveCowManagement } from '@pages/CowPenManagement/components/MoveCowManagement';

import ApplicationManagement from '@pages/ApplicationManagement';
import Application from '@pages/ApplicationManagement/Application-management';
import ApplicationType from '@pages/ApplicationManagement/ApplicationType';

import { SiHappycow } from 'react-icons/si';
import ErrorPageNotification from '@pages/Error';
import Equipment from '@pages/WarehouseManagement/components/Equipment';
const AreaDetail = lazy(
  () => import('@pages/AreaManagement/components/AreaDetail/AreaDetail')
);
const AreaList = lazy(
  () => import('@pages/AreaManagement/components/AreaList/AreaList')
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
      element: <Navigate to={user !== null ? '/dairy' : '/login'} />, // Redirect to /dashboard or another default path
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
      ],
    },
    {
      path: 'dairy',
      element:
        user !== null ? (
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
              path: 'health-report',
              element: SuspenseWrapper(<HealthReport />),
              children: [
                {
                  path: 'ill-ness',
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
            { path: '', element: SuspenseWrapper(<AreaList />) },
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
            { path: ':id', element: SuspenseWrapper(<DetailVaccineCycle />) },
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
          path: 'application-management',
          element: SuspenseWrapper(<ApplicationManagement />),
          children: [
            {
              path: '',
              element: <Navigate to={'application'} />,
            },

            {
              path: 'application',
              element: SuspenseWrapper(<Application />),
            },
            {
              path: 'application-type',
              element: SuspenseWrapper(<ApplicationType />),
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

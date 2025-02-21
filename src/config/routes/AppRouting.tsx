import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../core/store/store';
import { Spin } from 'antd';
import { lazy, Suspense } from 'react';
import { CowPenManagement } from '../../pages/CowPenManagement';
import { MoveCowManagement } from '../../pages/CowPenManagement/components/MoveCowManagement';

import ApplicationType from '../../pages/ApplicationManagement/ApplicationType';
import Application from '../../pages/ApplicationManagement/Application-management';
import ApplicationManagement from '../../pages/ApplicationManagement';

import FeedMealList from '../../pages/FeedManagement/FeedMeal/components/List/FeedMealList';
import CreateFeedMeal from '../../pages/FeedManagement/FeedMeal/components/CreateFeedMeal';

const ListItemBatch = lazy(
  () =>
    import(
      '../../pages/WarehouseManagement/components/Item/components/ItemBatch/components/ListItemBatch'
    )
);
const DetailItemBatch = lazy(
  () =>
    import(
      '../../pages/WarehouseManagement/components/Item/components/ItemBatch/components/DetailItemBatch'
    )
);
const ExportItem = lazy(
  () =>
    import(
      '../../pages/WarehouseManagement/components/Item/components/ExportItem'
    )
);
const ListExports = lazy(
  () =>
    import(
      '../../pages/WarehouseManagement/components/Item/components/ExportItem/ListExports'
    )
);
const DetailExport = lazy(
  () =>
    import(
      '../../pages/WarehouseManagement/components/Item/components/ExportItem/DetailExport'
    )
);
const MilkManagement = lazy(() => import('../../pages/MilkManagement'));
const MilkBatchManagement = lazy(
  () => import('../../pages/MilkManagement/MilkBatchManagement')
);
const HumanManagement = lazy(() => import('../../pages/HumanManangement'));
const ListWorker = lazy(
  () => import('../../pages/HumanManangement/WorkerManagement')
);
const ListVeterinarian = lazy(
  () => import('../../pages/HumanManangement/VeterinarianManagement')
);

// Lazy load components
const ItemDetail = lazy(
  () =>
    import(
      '../../pages/WarehouseManagement/components/Item/components/ItemDetail'
    )
);
const ItemBatchManagement = lazy(
  () =>
    import(
      '../../pages/WarehouseManagement/components/Item/components/ItemBatch'
    )
);
const AppDashboard = lazy(() => import('../../core/layout/AppDashboard'));
const CowManagement = lazy(() => import('../../pages/CowManagement'));
const PenManageMent = lazy(() => import('../../pages/PenManagement'));
const ListCow = lazy(
  () => import('../../pages/CowManagement/components/ListCow')
);
const AreaManagement = lazy(() => import('../../pages/AreaManagement'));
const CowTypeManagement = lazy(
  () => import('../../pages/CowManagement/components/CowTypeManagement')
);
const CreateCow = lazy(
  () => import('../../pages/CowManagement/components/CreateCow')
);
const LoginPage = lazy(() => import('../../pages/Login'));
const ForgetPassword = lazy(
  () => import('../../pages/Login/components/ForgetPassword')
);
const LoginForm = lazy(() => import('../../pages/Login/components/LoginForm'));
const Profile = lazy(() => import('../../pages/Profile'));
const ListRole = lazy(() => import('../../pages/RoleManagement'));
const ListUser = lazy(() => import('../../pages/UserManagement'));
const Dashboard = lazy(() => import('../../pages/Dashboard'));
const DailyMilkDashboard = lazy(
  () => import('../../pages/Dashboard/components/DailyMilk')
);
const CowDetail = lazy(
  () => import('../../pages/CowManagement/components/CowDetail')
);
const FeedMealManagement = lazy(
  () => import('../../pages/FeedManagement/FeedMeal')
);
const VaccineCycleManagement = lazy(
  () => import('../../pages/VaccineCycleManagement')
);
const ListVaccineCycle = lazy(
  () => import('../../pages/VaccineCycleManagement/components/ListVaccineCycle')
);
const DetailVaccineCycle = lazy(
  () =>
    import('../../pages/VaccineCycleManagement/components/DetailVaccineCycle')
);
const WarehouseManagement = lazy(
  () => import('../../pages/WarehouseManagement')
);
const Category = lazy(
  () => import('../../pages/WarehouseManagement/components/Category')
);
const ItemManagement = lazy(
  () => import('../../pages/WarehouseManagement/components/Item')
);
const ListItemManagement = lazy(
  () =>
    import(
      '../../pages/WarehouseManagement/components/Item/components/ListItem'
    )
);
const Warehouse = lazy(
  () => import('../../pages/WarehouseManagement/components/Warehouse')
);
const Supplier = lazy(
  () => import('../../pages/WarehouseManagement/components/Supplier')
);
const HealthReport = lazy(
  () => import('../../pages/CowManagement/components/HeathReport')
);
const IllNess = lazy(
  () => import('../../pages/CowManagement/components/HeathReport/IllNess')
);
// Add more components as needed...

const AppRouting = () => {
  const user = useSelector((state: RootState) => state.user);
  const SuspenseWrapper = (Component: JSX.Element) => (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center">
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
      element: SuspenseWrapper(<LoginPage />),
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
          SuspenseWrapper(<AppDashboard />)
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
              element: <FeedMealList />,
            },
            {
              path: 'create-feed-meal',
              element: <CreateFeedMeal />,
            },
          ],
        },
        {
          path: 'area-management',
          element: SuspenseWrapper(<AreaManagement />),
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
  ]);
  return <RouterProvider router={router} />;
};

export default AppRouting;

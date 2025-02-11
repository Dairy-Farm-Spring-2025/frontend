import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import AppDashboard from '../../core/layout/AppDashboard';
import CowManagement from '../../pages/CowManagement';
import ListCow from '../../pages/CowManagement/components/ListCow';

import { useSelector } from 'react-redux';
import { RootState } from '../../core/store/store';
import AreaManagement from '../../pages/AreaManagement';
import CowTypeManagement from '../../pages/CowManagement/components/CowTypeManagement';
import CreateCow from '../../pages/CowManagement/components/CreateCow';
import LoginPage from '../../pages/Login';
import ForgetPassword from '../../pages/Login/components/ForgetPassword';
import LoginForm from '../../pages/Login/components/LoginForm';
import Profile from '../../pages/Profile';
import ListRole from '../../pages/RoleManagement';
import ListUser from '../../pages/UserManagement';

import HumanManagement from '../../pages/HumanManangement';
import ListVeterinarian from '../../pages/HumanManangement/VeterinarianManagement';
import ListWorker from '../../pages/HumanManangement/WorkerManagement';
import PenManageMent from '../../pages/PenManagement';

import CowDetail from '../../pages/CowManagement/components/CowDetail';
import Dashboard from '../../pages/Dashboard';
import DailyMilkDashboard from '../../pages/Dashboard/components/DailyMilk';
import MilkManagement from '../../pages/MilkManagement';
import MilkBatchManagement from '../../pages/MilkManagement/MilkBatchManagement';
import WarehouseManagement from '../../pages/WarehouseManagement';
import Category from '../../pages/WarehouseManagement/components/Category';
import ItemManagement from '../../pages/WarehouseManagement/components/Item';
import ListItemManagement from '../../pages/WarehouseManagement/components/Item/components/ListItem';
import Warehouse from '../../pages/WarehouseManagement/components/Warehouse';
import ItemDetail from '../../pages/WarehouseManagement/components/Item/components/ItemDetail';
import { MoveCowManagement } from '../../pages/CowPenManagement/components/MoveCowManagement';
import { CowPenManagement } from '../../pages/CowPenManagement';
import Supplier from '../../pages/WarehouseManagement/components/Supplier';
import HealthReport from '../../pages/CowManagement/components/HeathReport';
import ItemBatchManagement from '../../pages/WarehouseManagement/components/Item/components/ItemBatch';
import ListItemBatch from '../../pages/WarehouseManagement/components/Item/components/ItemBatch/components/ListItemBatch';
import DetailItemBatch from '../../pages/WarehouseManagement/components/Item/components/ItemBatch/components/DetailItemBatch';


const AppRouting = () => {
  const user = useSelector((state: RootState) => state.user);
  const router = createBrowserRouter([
    {
      path: '',
      element: <Navigate to={user !== null ? '/dairy' : '/login'} />, // Redirect to /dashboard or another default path
    },
    {
      path: '/login',
      element: <LoginPage />,
      children: [
        {
          path: '',
          index: true,
          element: <LoginForm />,
        },
        {
          path: 'forget-password',
          element: <ForgetPassword />,
        },
      ],
    },
    {
      path: 'dairy',
      element: user !== null ? <AppDashboard /> : <Navigate to={'/login'} />,
      children: [
        {
          path: 'user-management',
          element: <ListUser />,
        },
        {
          path: 'role-management',
          element: <ListRole />,
        },

        {
          path: 'dashboard',
          element: <Dashboard />,
          children: [
            {
              path: '',
              element: <Navigate to={'daily-milk'} />,
            },
            {
              path: 'daily-milk',
              element: <DailyMilkDashboard />,
            },
          ],
        },
        {
          path: 'cow-management',
          element: <CowManagement />,
          children: [
            {
              path: '',
              element: <Navigate to={'list-cow'} />,
            },
            {
              path: ':id',
              element: <CowDetail />,
            },
            {
              path: 'cow-type-management',
              element: <CowTypeManagement />,
            },
            {
              path: 'list-cow',
              element: <ListCow />,
            },
            {
              path: 'create-cow',
              element: <CreateCow />,
            },
            {
              path: 'health-report',
              element: <HealthReport />,
            },
          ],
        },
        {
          path: 'area-management',
          element: <AreaManagement />,
        },
        {
          path: 'warehouse-management',
          element: <WarehouseManagement />,
          children: [
            {
              path: 'warehouse',
              element: <Warehouse />,
            },
            {
              path: 'category',
              element: <Category />,
            },
            {
              path: 'supplier',
              element: <Supplier />,
            },
            {
              path: 'item-management',
              element: <ItemManagement />,
              children: [
                {
                  path: '',
                  element: <ListItemManagement />,
                },
                {
                  path: ':id',
                  element: <ItemDetail />,
                },
                {
                  path: 'item-batch',
                  element: <ItemBatchManagement />,
                  children: [
                    {
                      path: '',
                      element: <ListItemBatch />,
                    },
                    {
                      path: ':id',
                      element: <DetailItemBatch />, 
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          path: 'pen-management',
          element: <PenManageMent />,
        },
        {
          path: 'move-cow-management',
          element: <CowPenManagement />,
          children: [
            {
              path: '',
              element: <MoveCowManagement />,
            },
          ],
        },
        {
          path: 'milk-management',
          element: <MilkManagement />,
          children: [
            {
              path: '',
              element: <Navigate to={'milk-batch'} />,
            },

            {
              path: ':id',
              element: <MilkBatchManagement />,
            },
          ],
        },
        {
          path: 'human-management',
          element: <HumanManagement />,
          children: [
            {
              path: '',
              element: <Navigate to={'worker'} />,
            },

            {
              path: 'worker',
              element: <ListWorker />,
            },
            {
              path: 'veterinarian',
              element: <ListVeterinarian />,
            },
          ],
        },
        {
          path: 'profile',
          element: <Profile />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRouting;

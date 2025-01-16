import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AppDashboard from "../../core/layout/AppDashboard";
import CowManagement from "../../pages/CowManagement";
import ListCow from "../../pages/CowManagement/components/ListCow";
import DairyManagement from "../../pages/DairyManagement";

import CreateCow from "../../pages/CowManagement/components/CreateCow";
import LoginPage from "../../pages/Login";
import ForgetPassword from "../../pages/Login/components/ForgetPassword";
import LoginForm from "../../pages/Login/components/LoginForm";
import Profile from "../../pages/Profile";
import ListRole from "../../pages/RoleManagement";
import ListUser from "../../pages/UserManagement";
import { useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import CowTypeManagement from "../../pages/CowManagement/components/CowTypeManagement";
import ListWorker from "../../pages/HumanManangement/WorkerManagement";
import HumanManagement from "../../pages/HumanManangement";
import ListVeterinarian from "../../pages/HumanManangement/VeterinarianManagement";
import PenManageMent from "../../pages/PenManagement";
const AppRouting = () => {
  const user = useSelector((state: RootState) => state.user);
  const router = createBrowserRouter([
    {
      path: "",
      element: <Navigate to={user.accessToken !== "" ? "/dairy" : "/login"} />, // Redirect to /dashboard or another default path
    },
    {
      path: "/login",
      element: <LoginPage />,
      children: [
        {
          path: "",
          index: true,
          element: <LoginForm />,
        },
        {
          path: "forget-password",
          element: <ForgetPassword />,
        },
      ],
    },
    {
      path: "dairy",
      element:
        user.accessToken !== "" ? <AppDashboard /> : <Navigate to={"/login"} />,
      children: [
        {
          path: "user-management",
          element: <ListUser />,
        },
        {
          path: "role-management",
          element: <ListRole />,
        },


        {
          path: "cow-management",
          element: <CowManagement />,
          children: [
            {
              path: "",
              element: <Navigate to={"list-cow"} />,
            },
            {
              path: "cow-type-management",
              element: <CowTypeManagement />,
            },
            {
              path: "list-cow",
              element: <ListCow />,
            },
            {
              path: "create-cow",
              element: <CreateCow />,
            },
            {
              path: "health-report",
              element: <p>Health Report</p>,
            },
          ],

        },
        {
          path: "pen-management",
          element: <PenManageMent />,
        },
        {
          path: "human-management",
          element: <HumanManagement />,
          children: [
            {
              path: "",
              element: <Navigate to={"worker"} />,
            },
            // {
            //   path: "cow-type-management",
            //   element: <CowTypeManagement />,
            // },
            {
              path: "worker",
              element: <ListWorker />,
            },
            {
              path: "veterinarian",
              element: <ListVeterinarian />,
            },

          ],
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRouting;

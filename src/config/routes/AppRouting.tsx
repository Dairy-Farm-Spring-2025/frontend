import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AppDashboard from "../../core/layout/AppDashboard";
import DairyManagement from "../../pages/DairyManagement";
import CowManagement from "../../pages/CowManagement";
import ListCow from "../../pages/CowManagement/components/ListCow";

import LoginPage from "../../pages/Login";
import CreateCow from "../../pages/CowManagement/components/CreateCow";
import LoginForm from "../../pages/Login/components/LoginForm";
import ForgetPassword from "../../pages/Login/components/ForgetPassword";
import UserManagement from "../../pages/RoleManagement";
import ListUser from "../../pages/UserManagement";
import ListRole from "../../pages/RoleManagement";
const AppRouting = () => {
  const role = null;
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to={role ? "/dairy" : "/login"} />, // Redirect to /dashboard or another default path
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
      element: <AppDashboard />,
      children: [
        {
          path: "user-management",
          element: <ListUser />
        },
        {
          path: "role-management",
          element: <ListRole />
        },

        {
          path: "dairy-management",
          element: <DairyManagement />,
        },
        {
          path: "cow-management",
          element: <CowManagement />,
          children: [
            {
              path: "",
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
          path: "profile",
          element: <p>Profile</p>,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRouting;

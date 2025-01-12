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
          element: <ListUser />,
        },
        {
          path: "role-management",
          element: <ListRole />,
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
              element: <Navigate to={"list-cow"} />,
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
          path: "profile",
          element: <Profile />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRouting;

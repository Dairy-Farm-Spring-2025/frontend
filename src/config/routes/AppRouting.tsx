import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppDashboard from "../../core/layout/AppDashboard";
import DairyManagement from "../../pages/DairyManagement";
import CowManagement from "../../pages/CowManagement";
import ListCow from "../../pages/CowManagement/components/ListCow";

import LoginPage from "../../pages/Login";
import CreateCow from "../../pages/CowManagement/components/CreateCow";
const AppRouting = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "",
      element: <AppDashboard />,
      children: [
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

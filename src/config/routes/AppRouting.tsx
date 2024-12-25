import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppDashboard from "../../core/layout/AppDashboard";
import DairyManagement from "../../pages/DairyManagement";

const AppRouting = () => {
  const router = createBrowserRouter([
    {
      path: "",
      element: <AppDashboard />,
      children: [
        {
          path: "dairy-management",
          element: <DairyManagement />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRouting;

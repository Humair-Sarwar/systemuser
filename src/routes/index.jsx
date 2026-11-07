import { createBrowserRouter, Navigate } from "react-router";
import AuthRoutes from "./AuthRoutes";
import SystemUserRoutes from "./SystemUserRoutes";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/systermuser/dashboard" replace />,
    },
    ...AuthRoutes,
    ...SystemUserRoutes,
]);

export default router;

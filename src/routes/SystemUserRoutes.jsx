import React from "react";
import SystemUserLayout from "../layouts/SystemUser/SystemUserLayout";
import SystemUserDashboard from "../pages/systemuser/SystemUserDashboard";
import Roles from "../pages/systemuser/Roles";
import Countries from "../pages/systemuser/Countries";
import Cities from "../pages/systemuser/Cities";
import Users from "../pages/systemuser/Users";
import Businesses from "../pages/systemuser/Businesses";
import PrivateSystemUserRoute from "./PrivateSystemUserRoute";
import ScrollToTop from "../components/ScrollToTop";

const SystemUserRoutes = [
  {
    path: "/systermuser",
    element: (
      <>
        <ScrollToTop />
        <PrivateSystemUserRoute>
          <SystemUserLayout />
        </PrivateSystemUserRoute>
      </>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <PrivateSystemUserRoute>
            <SystemUserDashboard />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "users",
        element: (
          <PrivateSystemUserRoute>
            <Users />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "businesses",
        element: (
          <PrivateSystemUserRoute>
            <Businesses />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "roles",
        element: (
          <PrivateSystemUserRoute>
            <Roles />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "locations/countries",
        element: (
          <PrivateSystemUserRoute>
            <Countries />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "countries",
        element: (
          <PrivateSystemUserRoute>
            <Countries />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "locations/cities",
        element: (
          <PrivateSystemUserRoute>
            <Cities />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "cities",
        element: (
          <PrivateSystemUserRoute>
            <Cities />
          </PrivateSystemUserRoute>
        ),
      },
    ],
  },
  // Also support alias /systemuser
  {
    path: "/systemuser",
    element: (
      <>
        <ScrollToTop />
        <PrivateSystemUserRoute>
          <SystemUserLayout />
        </PrivateSystemUserRoute>
      </>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <PrivateSystemUserRoute>
            <SystemUserDashboard />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "users",
        element: (
          <PrivateSystemUserRoute>
            <Users />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "businesses",
        element: (
          <PrivateSystemUserRoute>
            <Businesses />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "roles",
        element: (
          <PrivateSystemUserRoute>
            <Roles />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "locations/countries",
        element: (
          <PrivateSystemUserRoute>
            <Countries />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "countries",
        element: (
          <PrivateSystemUserRoute>
            <Countries />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "locations/cities",
        element: (
          <PrivateSystemUserRoute>
            <Cities />
          </PrivateSystemUserRoute>
        ),
      },
      {
        path: "cities",
        element: (
          <PrivateSystemUserRoute>
            <Cities />
          </PrivateSystemUserRoute>
        ),
      },
    ],
  },
];

export default SystemUserRoutes;

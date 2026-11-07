import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";

// Navigation for System User Portal
const SYSTEM_USER_NAVIGATION = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "users",
    title: "Users",
    icon: <PeopleOutlineRoundedIcon />,
  },
  {
    segment: "businesses",
    title: "Businesses",
    icon: <StorefrontOutlinedIcon />,
  },
  {
    segment: "roles",
    title: "Roles",
    icon: <AdminPanelSettingsOutlinedIcon />,
  },
  {
    segment: "locations",
    title: "Locations",
    icon: <PublicOutlinedIcon />,
    children: [
      {
        segment: "locations/countries",
        title: "Countries",
      },
      {
        segment: "locations/cities",
        title: "Cities",
      },
    ],
  },
];

export default function SystemUserLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLeftSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Sidebar with Dashboard, Users, Businesses, Roles and Locations */}
      <AdminSidebar
        navigation={SYSTEM_USER_NAVIGATION}
        sidebarOpen={sidebarOpen}
        title="System Portal"
        baseRoute="/systermuser"
      />

      <Box
        className="admin-layout-full"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          width: { md: "calc(100% - 280px)", xs: "100%" },
          ml: { md: "280px", xs: 0 },
          height: "auto",
          minHeight: "100vh",
          transition: "all 0.3s ease",
        }}
      >
        <AdminHeader handleLeftSidebar={handleLeftSidebar} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: { xs: 2, sm: 3, md: 3.5 },
            pt: { xs: 2, sm: 2.25, md: 2.5 },
            pb: { xs: 3, sm: 3.5, md: 4 },
            backgroundColor: "#f4f6f9",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

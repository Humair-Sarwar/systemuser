import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  Typography,
  Collapse,
  Avatar,
} from "@mui/material";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

// Icons
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Logic Hooks & Toast
import { useLogout } from "../hook/auth/useLogout";
import { handleSuccess } from "../toast";

// Badges map to match the reference UI
const BADGE_MAP = {
  Products: 4,
  Orders: 8,
  Policies: 2,
  Reports: 2,
  Settings: 3,
};

const AdminSidebar = ({ navigation, sidebarOpen, title, baseRoute = "/systermuser" }) => {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const location = useLocation();

  // State for collapsible submenus
  const [openMenus, setOpenMenus] = useState({});
  const [menuSectionOpen, setMenuSectionOpen] = useState(true);
  const [othersSectionOpen, setOthersSectionOpen] = useState(true);

  // Auto-expand menu when a child route is active
  useEffect(() => {
    if (!navigation || !Array.isArray(navigation)) return;

    navigation.forEach((navItem) => {
      if (navItem.children && navItem.children.length > 0) {
        const isChildActive = navItem.children.some((child) => {
          if (!child.segment) return false;
          const currentPath = location.pathname;
          return (
            currentPath === `/vendor/${child.segment}` ||
            currentPath.startsWith(`/vendor/${child.segment}/`) ||
            currentPath.includes(child.segment)
          );
        });

        if (isChildActive) {
          setOpenMenus((prev) => ({ ...prev, [navItem.title]: true }));
        }
      }
    });
  }, [location.pathname, navigation]);

  const toggleSubMenu = (menuTitle) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuTitle]: !prev[menuTitle],
    }));
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_type");
        handleSuccess("You are logout!");
        navigate("/login");
      },
      onError: () => {
        localStorage.clear();
        navigate("/login");
      },
    });
  };

  // Helper to determine if a parent item or any of its children is currently active
  const isParentActive = (navItem) => {
    if (!navItem.children || navItem.children.length === 0) return false;
    return navItem.children.some((child) => {
      if (!child.segment) return false;
      const currentPath = location.pathname;
      const targetPath = child.segment.startsWith("/") ? child.segment : `${baseRoute}/${child.segment}`;
      return (
        currentPath === targetPath ||
        currentPath.startsWith(`${targetPath}/`) ||
        currentPath.includes(child.segment)
      );
    });
  };

  const isItemActive = (segment) => {
    if (!segment) return false;
    const targetPath = segment.startsWith("/") ? segment : `${baseRoute}/${segment}`;
    return (
      location.pathname === targetPath ||
      location.pathname.startsWith(`${targetPath}/`) ||
      location.pathname.includes(segment)
    );
  };

  // Split navigation items into MENU (core operations) and OTHERS (secondary)
  const menuTitles = [
    "Dashboard",
    "Users",
    "Businesses",
    "Products",
    "Orders",
    "Brands",
    "Categories",
    "Attributes & Terms",
    "Vouchers & Gift Cards",
    "Roles",
    "Locations",
  ];

  const menuItems = (navigation || []).filter((item) =>
    menuTitles.includes(item.title)
  );
  const otherItems = (navigation || []).filter(
    (item) => !menuTitles.includes(item.title)
  );

  const renderNavItem = (navItem, index) => {
    const hasChildren = navItem.children && navItem.children.length > 0;
    const isOpen = Boolean(openMenus[navItem.title]);
    const parentActive = isParentActive(navItem);
    const itemActive = !hasChildren && isItemActive(navItem.segment);
    const badge = BADGE_MAP[navItem.title];

    return (
      <ListItem className="item" key={index} sx={{ width: "100%", p: 0 }}>
        {hasChildren ? (
          // Parent with dropdown
          <Box
            component="a"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggleSubMenu(navItem.title);
            }}
            className={parentActive ? "active-item" : ""}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <span className="icons-sidebar-menu">{navItem.icon}</span>
              <Typography sx={{ fontSize: "13.5px", fontWeight: parentActive ? 600 : 500 }}>
                {navItem.title}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              {badge && <span className="sidebar-counter-badge">{badge}</span>}
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: "18px",
                  transition: "transform 0.25s ease",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  color: parentActive ? "#ffffff" : "#94a3b8",
                }}
              />
            </Box>
          </Box>
        ) : (
          // Direct Link Item
          <NavLink
            to={navItem.segment.startsWith("/") ? navItem.segment : `${baseRoute}/${navItem.segment}`}
            className={({ isActive }) => (isActive || itemActive ? "active-item" : "")}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <span className="icons-sidebar-menu">{navItem.icon}</span>
              <Typography sx={{ fontSize: "13.5px", fontWeight: itemActive ? 600 : 500 }}>
                {navItem.title}
              </Typography>
            </Box>

            {badge && <span className="sidebar-counter-badge">{badge}</span>}
          </NavLink>
        )}

        {/* Refined Submenu Expansion with Tree Guide Line */}
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit sx={{ width: "100%" }}>
            <Box className="sidebar-submenu-tree">
              {navItem.children.map((child, cIdx) => (
                <NavLink
                  key={cIdx}
                  to={child.segment.startsWith("/") ? child.segment : `${baseRoute}/${child.segment}`}
                  className={({ isActive }) =>
                    `sidebar-submenu-link ${isActive ? "active-sub-link" : ""}`
                  }
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="submenu-dot" />
                    <span className="submenu-text">{child.title}</span>
                  </Box>
                </NavLink>
              ))}
            </Box>
          </Collapse>
        )}
      </ListItem>
    );
  };

  return (
    <Box
      className={
        sidebarOpen
          ? "admin-side-style-show admin-side-style"
          : "admin-side-style"
      }
    >
      {/* 1. Brand Logo Header (Shows official logo instead of Teknova Store text) */}
      <Box className="store-selector-header">
        <NavLink
          to="/systermuser/dashboard"
          style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
        >
          <img
            src="/self_mart_1755699970080.png"
            alt="Logo"
            style={{
              height: "36px",
              maxWidth: "175px",
              objectFit: "contain",
              display: "block",
            }}
          />
        </NavLink>
        <span className="pro-badge-pill" style={{ backgroundColor: "#2563eb" }}>Admin</span>
      </Box>

      {/* 2. Scrollable Navigation Sections */}
      <Box className="menu-scrollable-container" sx={{ pt: 1 }}>
        {/* SECTION: MENU */}
        <Box
          className="sidebar-section-heading"
          onClick={() => setMenuSectionOpen(!menuSectionOpen)}
          sx={{ cursor: "pointer" }}
        >
          <span>MENU</span>
          <KeyboardArrowUpIcon
            sx={{
              fontSize: "16px",
              color: "#94a3b8",
              transform: menuSectionOpen ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </Box>

        <Collapse in={menuSectionOpen} timeout="auto">
          <List className="menu-list">
            {menuItems.map((item, index) => renderNavItem(item, index))}
          </List>
        </Collapse>

        {/* SECTION: OTHERS */}
        <Box
          className="sidebar-section-heading"
          onClick={() => setOthersSectionOpen(!othersSectionOpen)}
          sx={{ cursor: "pointer", mt: 1.5 }}
        >
          <span>OTHERS</span>
          <KeyboardArrowUpIcon
            sx={{
              fontSize: "16px",
              color: "#94a3b8",
              transform: othersSectionOpen ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </Box>

        <Collapse in={othersSectionOpen} timeout="auto">
          <List className="menu-list">
            {otherItems.map((item, index) => renderNavItem(item, index))}

            {/* Logout Item */}
            <ListItem className="item" sx={{ width: "100%", p: 0 }}>
              <NavLink to="#" onClick={handleLogout}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <span className="icons-sidebar-menu">
                    <LogoutIcon />
                  </span>
                  <Typography sx={{ fontSize: "13.5px", fontWeight: 500 }}>
                    Logout
                  </Typography>
                </Box>
              </NavLink>
            </ListItem>
          </List>
        </Collapse>
      </Box>

      {/* 3. Bottom Profile Card (Without three dots) */}
      <Box className="sidebar-profile-card">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#2563eb",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            SA
          </Avatar>
          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#0f172a",
                lineHeight: 1.2,
              }}
            >
              System Administrator
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.2 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "#2563eb",
                }}
              />
              <Typography sx={{ fontSize: "11px", color: "#64748b" }}>
                systemuser@gmail.com
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminSidebar;
import { Outlet, useLocation } from "react-router";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CircleIcon from "@mui/icons-material/Circle";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AdminSidebar from "../../components/AdminSidebar";
import { Box } from "@mui/material";
import AdminHeader from "../../components/AdminHeader";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import { useEffect, useState } from "react";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import GavelIcon from "@mui/icons-material/Gavel";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import PeopleIcon from "@mui/icons-material/People";
import SettingsInputComponentTwoToneIcon from '@mui/icons-material/SettingsInputComponentTwoTone';
import nprogress from "nprogress"; // nprogress import karein
import "nprogress/nprogress.css"; // CSS lazmi import karein

const NAVIGATION = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "products",
    title: "Products",
    icon: (
      <svg
        class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-bbh01c"
        focusable="false"
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 9.0049C8 7.0583 9.59259 5.47897 11.5556 5.47897C13.5185 5.47897 15.1111 7.0583 15.1111 9.0049C15.1111 10.9515 13.5185 12.5308 11.5556 12.5308C9.59259 12.5308 8 10.9515 8 9.0049ZM13.2173 8.49805C13.3728 8.34624 13.3728 8.09649 13.2173 7.94467C13.0642 7.79042 12.8123 7.79042 12.6593 7.94467L11.1605 9.43095L10.4519 8.72821C10.2988 8.57395 10.0469 8.57395 9.89383 8.72821C9.73827 8.88002 9.73827 9.12978 9.89383 9.28159L10.8815 10.261C11.0346 10.4153 11.2864 10.4153 11.4395 10.261L13.2173 8.49805Z"
          fill="currentColor"
          class="secondary"
        ></path>
        <path
          d="M2.14148 1.42738C2.34222 1.02924 2.75259 0.777778 3.20173 0.777778H6.02469V3.91193H0.888889L2.14148 1.42738ZM6.81482 3.91193V0.777778H9.63704C10.0864 0.777778 10.4963 1.02924 10.6988 1.42738L11.9506 3.91193H6.81482ZM11.1605 4.71261C8.94568 4.91095 7.20988 6.75716 7.20988 9.00494C7.20988 10.0456 7.58272 11.003 8.20247 11.7473H2.46914C1.5963 11.7473 0.888889 11.0446 0.888889 10.1802V4.69547H11.1605V4.71261Z"
          fill="currentColor"
        ></path>
      </svg>
    ),
  },
  {
    segment: "",
    title: "Orders",
    icon: <ShoppingCartIcon />,
    children: [
      {
        segment: "orders/buy",
        title: "Sales",
        icon: <CircleIcon sx={{ fontSize: "6px" }} />,
      },
      {
        segment: "orders/trade-in",
        title: "Trade-in",
        icon: <CircleIcon sx={{ fontSize: "6px" }} />,
      },
      {
        segment: "orders/trade-in",
        title: "Repair",
        icon: <CircleIcon sx={{ fontSize: "6px" }} />,
      },
    ],
  },
  {
    segment: "brands",
    title: "Brands",
    icon: <LocalOfferIcon />,
  },
  {
    segment: "categories",
    title: "Categories",
    icon: <CategoryIcon />,
  },
  {
    segment: "attributes-terms",
    title: "Attributes & Terms",
    icon: <SettingsInputComponentTwoToneIcon />,
  },
  {
    segment: "voucher-and-gift-cards",
    title: "Vouchers & Gift Cards",
    icon: <CardGiftcardIcon />,
    children: [
      {
        segment: "vouchers",
        title: "Vouchers",
        icon: <CircleIcon sx={{ fontSize: "6px" }} />,
      },
      {
        segment: "gift-cards",
        title: "Gift Cards",
        icon: <CircleIcon sx={{ fontSize: "6px" }} />,
      },
    ],
  },
  {
    segment: "",
    title: "Policies",
    icon: <GavelIcon />,
    children: [
      {
        segment: "warranty-policy",
        title: "Warranty Policy",
        icon: <CircleIcon sx={{ fontSize: "6px" }} />,
      },
      {
        segment: "return-policy",
        title: "Return Policy",
        icon: <CircleIcon sx={{ fontSize: "6px" }} />,
      },
    ],
  },

  {
    segment: "media",
    title: "Media",
    icon: <PermMediaIcon />,
  },
  {
    segment: "pages",
    title: "Pages",
    icon: <AutoStoriesIcon />,
  },
  {
    segment: "ads",
    title: "Ads",
    icon: <AdsClickIcon />,
  },
  {
    segment: "customers",
    title: "Customers",
    icon: <PeopleIcon />,
  },
  {
    segment: "",
    title: "Settings",
    icon: <SettingsIcon />,
    children: [
      {
        segment: "settings/site-settings",
        title: "Site Settings",
        icon: <CircleIcon sx={{ fontSize: "6px" }} />,
      },
      {
        segment: "settings/shipping-methods",
        title: "Shipping Methods",
        icon: <CircleIcon sx={{ fontSize: "6px" }} />,
      },
      {
        segment: "settings/account-settings",
        title: "Account Settings",
        icon: <CircleIcon sx={{ fontSize: "6px" }} />,
      },
      {
        segment: "settings/business-settings",
        title: "Business Settings",
        icon: <CircleIcon sx={{ fontSize: "6px" }} />,
      },
    ],
  },
];

export default function AdminLayout(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLeftSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  const location = useLocation(); // URL track karne ke liye

  // NProgress Configuration (Optional)
  useEffect(() => {
    nprogress.configure({ showSpinner: false, speed: 400 });
  }, []);

  // Jab bhi path change ho, progress bar chalayein
  useEffect(() => {
    nprogress.start();
    
    // Page render hone par bar khatam karein
    // Ek chota timeout takay bar thori nazar aaye (premium feel)
    const timer = setTimeout(() => {
      nprogress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      nprogress.done();
    };
  }, [location.pathname]);








  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AdminSidebar
          navigation={NAVIGATION}
          title={"Vendor"}
          sidebarOpen={sidebarOpen}
        />
        <Box className="admin-layout-full">
          <AdminHeader handleLeftSidebar={handleLeftSidebar} />
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

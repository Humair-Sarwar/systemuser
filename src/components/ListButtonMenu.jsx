import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router";
import SpeedIcon from '@mui/icons-material/Speed';
import CategoryIcon from '@mui/icons-material/Category';
import { handleSuccess } from "../toast";
import { useLogout } from "../hook/auth/useLogout";

const settings = [
  {
    icon: <LocalMallIcon sx={{ fontSize: "20px", mr: 1 }} />,
    name: "Orders",
    url: "/buy/orders",
    type: 1,
  },
  {
    icon: <ManageAccountsIcon sx={{ fontSize: "20px", mr: 1 }} />,
    name: "Profile",
    url: "/profile",
    type: 1,
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: "20px", mr: 1 }} />,
    name: "Address",
    url: "/addresses",
    type: 1,
  },
  {
    icon: <FavoriteBorderIcon sx={{ fontSize: "20px", mr: 1 }} />,
    name: "Wishlist",
    url: "/wishlist",
    type: 1,
  },


  {
    icon: <SpeedIcon sx={{ fontSize: "20px", mr: 1 }} />,
    name: "Dashboard",
    url: "/vendor/dashboard",
    type: 2,
  },
  {
    icon: <CategoryIcon sx={{ fontSize: "20px", mr: 1 }} />,
    name: "Products",
    url: "/vendor/products",
    type: 2,
  },
  
  
];

function ListButtonMenu({userType}) {
  const navigate = useNavigate()
  const logoutMutation = useLogout();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (url) => {
    setAnchorElUser(null);
    navigate(url)
  };

  const handleLogout = () => {
  logoutMutation.mutate(undefined, {
    onSuccess: () => {
      localStorage.clear();
      setAnchorElUser(null);
      handleSuccess("You are logout!");
      navigate("/");
    },
    onError: () => {
      localStorage.clear();
      setAnchorElUser(null);
      navigate("/");
    },
  });
};

  return (
    <Toolbar disableGutters sx={{ minHeight: "0px !important" }}>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open Menu">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt="E" src="/static/images/avatar/2.jpg" />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px"}}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {
          settings.filter((setting)=>(
            setting.type == userType)).map((setting, index) => (
          
            <MenuItem key={index} onClick={()=>handleCloseUserMenu(setting.url)}>
              <Typography
                sx={{
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  color: "#424242ff",
                }}
              >
                {setting.icon} {setting.name}
              </Typography>
            </MenuItem>
          ))}
          <MenuItem onClick={handleLogout}>
              <Typography
                sx={{
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  color: "#424242ff",
                }}
              >
                <LogoutIcon sx={{ fontSize: "20px", mr: 1 }} /> Logout
              </Typography>
            </MenuItem>
        </Menu>
      </Box>
    </Toolbar>
  );
}
export default ListButtonMenu;

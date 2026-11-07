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
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Badge } from "@mui/material";
import NotificationsTabs from "./NotificationsTabs";


function NotificationsMenu() {
  const navigate = useNavigate()
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (url) => {
    setAnchorElUser(null);
    navigate(url)
  };

 

  return (
    <Toolbar disableGutters sx={{ minHeight: "0px !important" }}>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Notifications"  onClick={handleOpenUserMenu}>
          <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsNoneIcon />
              </Badge>
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
         
         
             <NotificationsTabs indx={0}/>
            
        
        
        </Menu>
      </Box>
    </Toolbar>
  );
}
export default NotificationsMenu;

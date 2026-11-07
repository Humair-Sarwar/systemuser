import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { Badge, CardMedia, Container, List, ListItem } from "@mui/material";

import { Link, NavLink } from "react-router";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useEffect } from "react";
import ResponsiveViewMenu from "../../../components/ResponsiveViewMenu";
import SearchModal from "../../../components/SearchModal";
import MiniAddToCartModal from "../../../components/MiniAddToCartModal";
import { getSiteMenuApi } from "../../../utils/apis/APIs";
import ListButtonMenu from "../../../components/ListButtonMenu";

import NotificationsMenu from "../../../components/Notification";
import { fetchSiteMenu } from "../../../hook/website/useSiteMenu";

export default function Header() {
  const [userType, setUserType] = React.useState(localStorage.getItem("user_type"));

  const headerRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        headerRef.current?.classList.add("slidedown");
      } else {
        headerRef.current?.classList.remove("slidedown");
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Run once in case user reloads mid-scroll
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);




// Listen for logout/login changes (using storage event for multi-tab safety)
  React.useEffect(() => {
    const handleStorageChange = () => {
      setUserType(localStorage.getItem("user_type"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ also catch same-tab changes (when logout clears localStorage)
  React.useEffect(() => {
    const interval = setInterval(() => {
      const storedType = localStorage.getItem("user_type");
      if (storedType !== userType) {
        setUserType(storedType);
      }
    }, 300); // poll every 300ms
    return () => clearInterval(interval);
  }, [userType]);



  const { data: menuItemsList, isLoading } = fetchSiteMenu({key: "general-menu"});

  return (
    <>
      <Box className="slide-text-section-mini-header">
        <Box className="text_scroller_1 scroller_item_1 ul-li">
          <List>
            <ListItem>
              <h3>Free shipping on all orders above £35</h3>
            </ListItem>
            <ListItem>
              <FiberManualRecordIcon sx={{ fontSize: "6px", color: "white" }} />
            </ListItem>
            <ListItem>
              <h3>Free shipping on all orders above £35</h3>
            </ListItem>
            <ListItem>
              <FiberManualRecordIcon sx={{ fontSize: "6px", color: "white" }} />
            </ListItem>
            <ListItem>
              <h3>Free shipping on all orders above £35</h3>
            </ListItem>
            <ListItem>
              <FiberManualRecordIcon sx={{ fontSize: "6px", color: "white" }} />
            </ListItem>
            <ListItem>
              <h3>Free shipping on all orders above £35</h3>
            </ListItem>
            <ListItem>
              <FiberManualRecordIcon sx={{ fontSize: "6px", color: "white" }} />
            </ListItem>
            <ListItem>
              <h3>Free shipping on all orders above £35</h3>
            </ListItem>
            <ListItem>
              <FiberManualRecordIcon sx={{ fontSize: "6px", color: "white" }} />
            </ListItem>
          </List>
          <List aria-hidden="true">
            <ListItem>
              <h3>Free shipping on all orders above £35</h3>
            </ListItem>
            <ListItem>
              <FiberManualRecordIcon sx={{ fontSize: "6px", color: "white" }} />
            </ListItem>
            <ListItem>
              <h3>Free shipping on all orders above £35</h3>
            </ListItem>
            <ListItem>
              <FiberManualRecordIcon sx={{ fontSize: "6px", color: "white" }} />
            </ListItem>
            <ListItem>
              <h3>Free shipping on all orders above £35</h3>
            </ListItem>
            <ListItem>
              <FiberManualRecordIcon sx={{ fontSize: "6px", color: "white" }} />
            </ListItem>
            <ListItem>
              <h3>Free shipping on all orders above £35</h3>
            </ListItem>
            <ListItem>
              <FiberManualRecordIcon sx={{ fontSize: "6px", color: "white" }} />
            </ListItem>
            <ListItem>
              <h3>Free shipping on all orders above £35</h3>
            </ListItem>
            <ListItem>
              <FiberManualRecordIcon sx={{ fontSize: "6px", color: "white" }} />
            </ListItem>
          </List>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          sx={{
            backgroundColor: "white",
            color: "black",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            position: "relative",
            width: "100%",
            paddingRight: "0px !important",
          }}
          className="header-main-target"
          ref={headerRef}
        >
          <Container sx={{ maxWidth: "1450px !important", position: "unset" }}>
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "unset",
                px: "0 !important",
              }}
            >
              <Box className="left-menu-icon-setup">
                <ResponsiveViewMenu />

                <SearchModal />
              </Box>

              <Link to={"/"}>
                <CardMedia
                  component="img"
                  style={{ height: "auto", width: "60px" }}
                  image="/logo.png"
                  alt="Footer Logo"
                />
              </Link>
              <Box sx={{ display: "flex" }} className="desktop-menu-style">
                {menuItemsList?.data?.is_active == true && (
                  <List className="menu-items-style-main">
                    {menuItemsList?.data?.menu?.menuItems?.map((list, i) => (
                      <>
                        <ListItem
                          className={
                            list?.columns?.length > 0
                              ? "list-item-style"
                              : "list-item-style-without-expand"
                          }
                          key={i}
                        >
                          <Link to={list?.href}>
                            {" "}
                            <Typography sx={{ fontWeight: "600" }}>
                              {list?.title}
                            </Typography>
                            {list?.columns?.length > 0 && (
                              <KeyboardArrowDownIcon
                                sx={{ fontSize: "20px", marginLeft: "4px" }}
                              />
                            )}
                          </Link>
                          <Box className="on-hover-menuitems-box-style">
                            <Container>
                              <Box sx={{ display: "flex", py: 3 }}>
                                <List
                                  sx={{
                                    display: "flex",
                                    flex: "auto",
                                    alignItems: "start",
                                    flexWrap: "wrap",
                                    flexDirection: "row",
                                  }}
                                >
                                  {list?.columns?.map((column, ind) => (
                                    <ListItem
                                      key={ind}
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "start",
                                        mr: 8,
                                        width: "210px",
                                        mb: 4,
                                      }}
                                    >
                                      <Link
                                        to={column?.href}
                                        className="meni-heading-link-style-set"
                                      >
                                        <Typography
                                          sx={{
                                            fontWeight: "600",
                                            fontSize: "21px",
                                          }}
                                        >
                                          {column?.title}
                                        </Typography>
                                      </Link>
                                      <List className="inner-menu-list-style-set-s">
                                        {column?.items?.map((item, indx) => (
                                          <ListItem>
                                            {" "}
                                            <Link to={item?.href}>
                                              <Typography variant="body1">
                                                {item?.label}
                                              </Typography>
                                            </Link>
                                          </ListItem>
                                        ))}
                                      </List>
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            </Container>
                          </Box>
                        </ListItem>

                        <Box className="over-bg-set-style-menu"></Box>
                      </>
                    ))}
                  </List>
                )}
              </Box>

              <Box>
                <Box sx={{ display: "flex" }}>
                  {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
{userType == 1 ?  <>
            <NotificationsMenu/></> : ''}
                  <Box className="desktop-search-icon-menu-style">
                    <SearchModal />
                  </Box>
                    
                  {userType == 1 || userType == 2 ? (
                    <ListButtonMenu userType={userType}/>
                  ) : (
                    <NavLink to={"/login"}>
                      <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        color="black"
                      >
                        <svg
                          role="presentation"
                          stroke-width="1.5"
                          focusable="false"
                          width="22"
                          height="22"
                          class="icon icon-account"
                          viewBox="0 0 22 22"
                        >
                          <circle
                            cx="11"
                            cy="7"
                            r="4"
                            fill="none"
                            stroke="currentColor"
                          ></circle>
                          <path
                            d="M3.5 19c1.421-2.974 4.247-5 7.5-5s6.079 2.026 7.5 5"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                          ></path>
                        </svg>
                      </IconButton>
                    </NavLink>
                  )}

                  <MiniAddToCartModal />
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </>
  );
}

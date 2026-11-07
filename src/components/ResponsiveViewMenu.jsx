import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Button, IconButton, List, ListItem, Typography } from "@mui/material";
import { Link } from "react-router";
import { useEffect } from "react";
import { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { getSiteMenuApi } from "../utils/apis/APIs";
import { fetchSiteMenu } from "../hook/website/useSiteMenu";

export default function ResponsiveViewMenu() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const [tState, setState] = useState(false);
  const [menuLists2, setMenuLists2] = useState([]);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
const { data, isLoading } = fetchSiteMenu("general-menu");

const menuLists1 = data?.data?.menu?.menuItems || [];
const isActive = data?.data?.is_active || false;
  const handleOpenNext = (data) => {
  setMenuLists2(data?.columns || []);
  setSelectedCategory(data?.title);
  setShowSubMenu(true);
};
  const handletoggleDrawerClose = () => {
  setOpen(false);
  setShowSubMenu(false);
};

  const handleBackCategory = () => {
  setShowSubMenu(false);
};
  const DrawerList = (
    <Box sx={{ width: 270 }} role="presentation">
      <Box sx={{ backgroundColor: "white", height: "40px" }}>
        <Button
          onClick={handletoggleDrawerClose}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "50%",
            height: "35px",
            minWidth: "25px",
            color: "black",
            mb: 1,
          }}
        >
          <svg
            role="presentation"
            stroke-width="2"
            focusable="false"
            width="19"
            height="19"
            class="icon icon-close"
            viewBox="0 0 24 24"
          >
            <path
              d="M17.658 6.343 6.344 17.657M17.658 17.657 6.344 6.343"
              stroke="currentColor"
            ></path>
          </svg>
        </Button>
      </Box>
      {!showSubMenu && isActive ? (
        <Box sx={{ height: "83vh", overflowY: "auto" }}>
          <List className="responsive-menu-list-style">
            {menuLists1?.map((list1, i) => (
              <ListItem key={i} className="menu-item-list-l">
                <Link to={list1?.href}>
                  <Typography sx={{ fontWeight: "600" }}>
                    {list1?.title}
                  </Typography>
                </Link>
                <Button
                  onClick={() => handleOpenNext(list1)}
                  sx={{ height: "22px", minWidth: "5px" }}
                  className="move-next-btn-style"
                >
                  <svg
                    role="presentation"
                    focusable="false"
                    width="5"
                    height="8"
                    class="icon icon-chevron-right-small reverse-icon"
                    viewBox="0 0 5 8"
                  >
                    <path
                      d="m.75 7 3-3-3-3"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    ></path>
                  </svg>
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        isActive == true && (
          <Box sx={{ height: "83vh", overflowY: "auto" }}>
            <List className="responsive-menu-list-style">
              <Box
                className="back-move-menu-list-btn"
                onClick={handleBackCategory}
              >
                <KeyboardArrowLeftIcon sx={{ fontSize: "20px", mr: 1 }} />{" "}
                {selectedCategory}
              </Box>
              {menuLists2?.map((list2, ind) => (
                <>
                  <ListItem
                    key={ind}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",

                      mb: 1,
                      pl: 0,
                    }}
                  >
                    <Link
                      to={list2?.href}
                      className="menu-inner-mobile-list-style"
                    >
                      <Typography
                        sx={{
                          fontWeight: "600",
                          fontSize: "21px",
                        }}
                      >
                        {list2?.title}
                      </Typography>
                    </Link>
                    <List>
                      {list2?.items?.map((listLabel, index) => (
                        <ListItem key={index}>
                          {" "}
                          <Link
                            to={listLabel?.href}
                            className="menu-inner-mobile-list-style-2"
                          >
                            <Typography variant="body1">
                              {listLabel?.label}
                            </Typography>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </ListItem>
                </>
              ))}
            </List>
          </Box>
        )
      )}
    </Box>
  );

  return (
    <>
      <IconButton size="large" color="black" onClick={toggleDrawer(true)}>
        <svg
          role="presentation"
          stroke-width="1.5"
          focusable="false"
          width="22"
          height="22"
          class="icon icon-hamburger"
          viewBox="0 0 22 22"
        >
          <path
            d="M1 5h20M1 11h20M1 17h20"
            stroke="currentColor"
            stroke-linecap="round"
          ></path>
        </svg>
      </IconButton>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        className="responsive-menu-list-style"
      >
        {DrawerList}
      </Drawer>
    </>
  );
}

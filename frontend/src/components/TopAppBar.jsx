import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAndRemoveAdmin } from "../reducers/userReducer";

const drawerWidth = 240;

const TopAppBar = () => {
  const navigate = useNavigate();
  const navItems = ["Home", "Archive", "Admin Login", "Logout"];
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleClick = (item) => {
    switch (item) {
      case "Home":
        navigate("/");
        break;
      case "Archive":
        navigate("/archive");
        break;
      case "Admin Login":
        navigate("/admin/login");
        break;
      case "Logout":
        dispatch(logoutAndRemoveAdmin());
        break;
      default:
        navigate("/");
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Star Stream
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => {
          if (item === "Admin Login" && user.isAdmin) {
            return null;
          } else if (item === "Logout" && !user.isAdmin) {
            return null;
          }
          return (
            <ListItem key={item} disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText
                  primary={item}
                  onClick={() => handleClick(item)}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar sx={{ backgroundColor: "white" }}>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h2"
            component="div"
            sx={{
              flexGrow: 1,
              color: "nokiaBrand",
              fontWeight: "bold",
              fontFamily: "Kanit, sans-serif",
            }}
          >
            Star Stream
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{
                  color: "black",
                  display:
                    item === "Admin Login" && user.isAdmin
                      ? "none"
                      : item === "Logout" && !user.isAdmin
                      ? "none"
                      : "",
                }}
                onClick={() => handleClick(item)}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

export default TopAppBar;

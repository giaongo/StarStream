import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  CssBaseline,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Slide,
} from "@mui/material";
import { Home, OndemandVideo, ManageAccounts } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAndRemoveAdmin } from "../reducers/userReducer";

const drawerWidth = 240;

const TopAppBar = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  // Define navItems dynamically based on user status
  let navItems = [
    { label: "Home", icon: <Home />, route: "/" },
    { label: "Archive", icon: <OndemandVideo />, route: "/archive" },
  ];

  // If the user is an admin, add the "Logout" option
  if (user.isAdmin) {
    navItems = navItems.slice(0, 2).concat({
      label: "Logout",
      icon: <ManageAccounts />,
      action: () => dispatch(logoutAndRemoveAdmin()),
    });
  } else {
    navItems = navItems.slice(0, 2).concat({
      label: "Admin Login",
      icon: <ManageAccounts />,
      route: "/admin/login",
    });
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClick = (item) => {
    if (item.route) {
      navigate(item.route);
    } else if (item.action) {
      item.action();
    }
    setMobileOpen(false); // Close drawer after selecting an option
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past a threshold
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        // Scrolling up or near the top
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{
          my: 2,
          fontFamily: "Kanit, sans-serif",
          fontWeight: "bold",
          letterSpacing: ".1rem",
          color: "white",
        }}
      >
        Star Stream
      </Typography>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => handleClick(item)}>
              {item.icon}
              <ListItemText primary={item.label} sx={{ ml: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <React.Fragment>
      <CssBaseline />
      <Slide in={showNavbar} appear={false} direction="down">
        <AppBar
          position="fixed"
          sx={{
            width: "100%",
            left: 0,
            right: 0,
            background:
              "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(135, 206, 250, 0.8) 100%)",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "0",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  fontFamily: "Kanit, sans-serif",
                  fontWeight: "bold",
                  letterSpacing: ".1rem",
                  color: "white",
                  textDecoration: "none",
                  display: { xs: "none", md: "flex" },
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              >
                Star Stream
              </Typography>

              {isMobile ? (
                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    color="inherit"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{
                      color: "white", // Set color to white when the drawer is open
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box
                  sx={{
                    flexGrow: 1,
                    display: { xs: "none", md: "flex" },
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Tabs centered>
                    {navItems.map(
                      (item, index) =>
                        (item.label !== "Logout" || user.isAdmin) && (
                          <Tab
                            key={index}
                            icon={item.icon}
                            iconPosition="start"
                            label={item.label}
                            onClick={() => handleClick(item)}
                            sx={{ color: "white", fontWeight: "bold" }}
                          />
                        )
                    )}
                  </Tabs>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </Slide>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background:
                "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(135, 206, 250, 0.8) 100%)",
              color: "white",
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Toolbar /> {/* Spacer to avoid content overlap */}
    </React.Fragment>
  );
};

export default TopAppBar;

import { createTheme, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import AddEventScreen from "./screens/AddEventScreen";
import VideoArchiveScreen from "./screens/VideoArchiveScreen";
import ViewingScreen from "./screens/ViewingScreen";
import TopAppBar from "./components/TopAppBar";
import MuiCssBaseline from "@mui/material/CssBaseline";
import Notification from "./components/Notification";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { checkAndSetAdminUser } from "./reducers/userReducer";
import { useAuthentication } from "./hooks/ApiHooks";
import ViewingArchiveScreen from "./screens/ViewingArchiveScreen";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkToken } = useAuthentication(navigate, dispatch);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#050960",
      },
      secondary: {
        main: "#E1F7F5",
      },
      nokiaBrand: "#005AFF",
      white: "#F9F9F9",
      lightGrey: "#C7C8CC",
      black: "#000000",
      deleteBtn: "#F6C7C7",
      liveBtn: "#BC0000",
      endedBtn: "#4CAF50",
      upcomingBtn: "#8A8A8A",
      liveBg: "rgba(255, 255, 255, 0.3)",
      addEventBtn: "#8D92FF",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: (themeParam) => ({
          body: {
            background:
              "linear-gradient(170deg, rgba(9,6,138,1) 0%, rgba(3,67,163,1) 46%, rgba(0,90,255,1) 75%)",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          },
        }),
      },
    },
  });

  theme.typography.h1 = {
    fontSize: "1.5rem",
    color: "#FFFFFF",
    fontFamily: "Iceland, sans-serif",
    fontWeight: "400",
    marginTop: "50px",
    textShadow: "1px 0.5px 2px #fff",
    "@media (min-width:600px)": {
      fontSize: "2.75rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "3rem",
    },
  };

  theme.typography.h2 = {
    fontSize: "1.125rem",
    color: "#FFFFFF",
    margin: 20,
    "@media (min-width:600px)": {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.875rem",
    },
  };

  theme.typography.h3 = {
    fontSize: "1.125rem",
    color: "white",
    "@media (min-width:600px)": {
      fontSize: "1.25rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.5rem",
    },
  };

  theme.typography.h4 = {
    fontSize: "1.125rem",
    color: "white",
    margin: 20,
    "@media (min-width:600px)": {
      fontSize: "1.125rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.125rem",
    },
  };

  theme.typography.subtitle1 = {
    frontSize: "0.6rem",
    color: "white",
    marginTop: 5,
    fontWeight: "lighter",
    "@media (min-width:600px)": {
      fontSize: "0.8rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
  };

  theme.typography.subtitle2 = {
    color: "white",
    marginTop: 5,
    fontWeight: "lighter",
    fontSize: "0.6rem",
    "@media (min-width:600px)": {
      fontSize: "0.6rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "0.8rem",
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("starStreamToken");
    if (token) {
      dispatch(checkAndSetAdminUser(token, checkToken));
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <MuiCssBaseline />
      <TopAppBar />
      <Notification />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/admin/login" element={<LoginScreen />} />
        <Route path="/admin/addEvent" element={<AddEventScreen />} />
        <Route path="/archive" element={<VideoArchiveScreen />} />
        <Route path="/event/:id" element={<ViewingScreen />} />
        <Route path="/archive/:id" element={<ViewingArchiveScreen />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

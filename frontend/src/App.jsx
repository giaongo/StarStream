import { createTheme, ThemeProvider } from "@mui/material";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import AddEventScreen from "./screens/AddEventScreen";
import VideoArchiveScreen from "./screens/VideoArchiveScreen";
import ViewingScreen from "./screens/ViewingScreen";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#050960",
      },
      secondary: {
        main: "#E1F7F5",
      },
    },
  });

  theme.typography.h3 = {
    fontSize: "1.8rem",
    margin: 20,
    "@media (min-width:600px)": {
      fontSize: "2rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "2.4rem",
    },
  };

  theme.typography.h6 = {
    fontSize: "0.8rem",
    "@media (min-width:600px)": {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.4rem",
    },
  };

  theme.typography.subtitle1 = {
    color: "text.secondary",
    marginTop: 5,
    fontWeight: "lighter",
    fontSize: "0.4rem",
    "@media (min-width:600px)": {
      fontSize: "0.6rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <h1>Hello there</h1>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/admin/login" element={<LoginScreen />} />
          <Route path="/admin/addEvent" element={<AddEventScreen />} />
          <Route path="/videoArchive" element={<VideoArchiveScreen />} />
          <Route path="/event/:id" element={<ViewingScreen />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

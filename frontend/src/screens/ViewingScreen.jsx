import React, { useRef } from "react";
import VideoJS from "../components/VideoJS";
import { Typography, Container, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import "../styles/App.css"

const ViewingScreen = () => {
  const playerRef = useRef(null);
  const location = useLocation();
  const event = location.state?.event;

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    experimentalSvgIcons: true,
    sources: [
      {
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        type: "video/mp4",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <>
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          margin: "20px",
        }}
      >
        <Box
          className="videoContainer"
          sx={{
            boxShadow: 3,
            flexGrow: 1,
            flexBasis: "45%",
          }}
        >
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          <button className="test">Test</button>
        </Box>

        <Box sx={{ flexGrow: 1, backgroundColor: "black", marginLeft: "10px" }}>
          <Typography variant="h2" sx={{ marginTop: "10px" }}>
            Live Chat
          </Typography>
          {/* This area allocates for chatbox component */}
        </Box>
      </Box>
      <Typography variant="h2" sx={{ margin: "30px" }}>
        {event.title}
      </Typography>
    </>
  );
};

export default ViewingScreen;

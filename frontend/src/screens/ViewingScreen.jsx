import React, { useRef } from "react";
import VideoJS from "../components/VideoJS";
import { Typography, Container, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

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
    <Box
      component="section"
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        marginTop: "20px",
      }}
    >
      <Typography variant="h2" sx={{ marginTop: "10px" }}>
        {event.title}
      </Typography>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />

      <Typography variant="h2" sx={{ marginTop: "10px" }}>
        Live Chat
      </Typography>
    </Box>
  );
};

export default ViewingScreen;

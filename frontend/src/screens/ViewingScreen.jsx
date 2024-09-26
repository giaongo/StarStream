import React, { useRef } from "react";
import VideoJS from "../components/VideoJS";
import { Typography, Container } from "@mui/material";
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
    <Container>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      <Typography variant="h2" sx={{ marginTop: "10px" }}>
        {event.title}
      </Typography>
    </Container>
  );
};

export default ViewingScreen;

import React, { useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import videojs from "video.js";
import VideoJS from "../components/VideoJS";
import { useRef } from "react";
import { useLocation } from "react-router-dom";

const ViewingArchiveScreen = () => {
  const playerRef = useRef(null);
  const location = useLocation();
  const videoInfo = location.state?.video;

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    experimentalSvgIcons: true,
    sources: [
      {
        src: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
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
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 20,
      }}
    >
      <Box sx={{ flexBasis: "20%", backgroundColor: "rgba(43, 43, 43, 0.5)" }}>
        <Typography variant="h2">{videoInfo?.title}</Typography>
      </Box>

      <Box sx={{ width: "50%" }}>
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      </Box>
    </Box>
  );
};

export default ViewingArchiveScreen;

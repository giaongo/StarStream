import React, { useRef } from "react";
import VideoJS from "../components/VideoJS";
import { Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import "../styles/App.css";

const ViewingScreen = () => {
  const playerRef = useRef(null);
  const location = useLocation();
  const event = location.state?.event;
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

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
          flexDirection: { xs: "column", sm: "row" },
          margin: "20px",
        }}
      >
        <Box
          className="videoContainer"
          sx={{
            boxShadow: 3,
            flexGrow: 1,
            flexBasis: { xs: "80%", sm: "45%" },
          }}
        >
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: "black",
            marginLeft: { xs: "0px", sm: "20px" },
            marginTop: { xs: "10px", sm: "0px" },
          }}
        >
          <Typography variant="h2" sx={{ marginTop: "10px" }}>
            Live Chat
          </Typography>
          {/* This area allocates for chatbox component */}
        </Box>
      </Box>
      <Box sx={{ marginLeft: "20px" }}>
        <Typography variant="h2" margin="0px">
          {event.title}
        </Typography>
        <Typography variant="subtitle1" component="div" display="inline">
          <b>From:</b> {startDate.toLocaleTimeString()} - <b>To: </b>{" "}
          {endDate.toLocaleTimeString()}
        </Typography>
      </Box>
    </>
  );
};

export default ViewingScreen;

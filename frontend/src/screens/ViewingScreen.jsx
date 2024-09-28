import React, { useEffect, useRef } from "react";
import VideoJS from "../components/VideoJS";
import { Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import "../styles/App.css";
import videojs from "video.js";
import Chat from "../components/Chat";

const ViewingScreen = () => {
  const playerRef = useRef(null);
  const location = useLocation();
  const event = location.state?.event;
  const viewing_url = location.state?.viewing_url.url;
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

  // TODO: replace the src with the viewing_url
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
    <Box sx={{ height: "100vh" }}>
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          margin: "1.1%",
          marginBottom: "10px",
        }}
      >
        <Box
          className="videoContainer"
          sx={{
            boxShadow: 3,
            flexGrow: 1,
            flexBasis: "48%",
          }}
        >
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            marginLeft: { xs: "0px", sm: "20px" },
            marginTop: { xs: "10px", sm: "0px" },
            flexBasis: { xs: "100%", sm: "5%" },
            backgroundColor: "black",
            boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h2" sx={{ marginTop: "10px" }}>
            Live Chat
          </Typography>
          {/* This area allocates for chatbox component */}
          <Chat eventId={event.id} />
        </Box>
      </Box>
      <Box sx={{ marginLeft: "2%" }}>
        <Typography variant="h2" margin="0px">
          {event.title}
        </Typography>
        <Typography variant="subtitle1" component="div" display="inline">
          <b>From:</b> {startDate.toLocaleTimeString()} - <b>To: </b>{" "}
          {endDate.toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default ViewingScreen;

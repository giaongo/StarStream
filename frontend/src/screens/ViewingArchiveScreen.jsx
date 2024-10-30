import React, { lazy, useState } from "react";
import { Box, CardMedia, Typography, Button } from "@mui/material";
import videojs from "video.js";
import VideoJS from "../components/VideoJS";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { baseUrl } from "../utils/variables";
import { useVideo } from "../hooks/ApiHooks";
import VideoChat from "../components/VideoChat";

const ViewingArchiveScreen = () => {
  const playerRef = useRef(null);
  const location = useLocation();
  const { initiateAIVideoChat } = useVideo();
  const videoInfo = location.state?.video;
  const startDate = new Date(videoInfo?.event_start_date);
  const endDate = new Date(videoInfo?.event_end_date);
  const [chatbotInitiated, setChatbotInitiated] = useState(false);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    experimentalSvgIcons: true,
    sources: [
      {
        // src: videoInfo?.video_path,
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        type: "video/mp4",
      },
    ],
    tracks: [
      {
        // src: videoInfo?.subtitle_path,
        kind: "subtitles",
        srclang: "en",
        label: "English",
        default: true,
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

  const initChatBot = async () => {
    try {
      const urlData = {
        video_url: videoInfo?.video_path,
        subtitle_url: videoInfo?.subtitle_path,
      };
      const result = await initiateAIVideoChat(urlData);
      if (result) {
        setChatbotInitiated(true);
      }
    } catch (error) {
      console.error("Error init chatbot: ", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mt: 20,
      }}
    >
      <Box
        sx={{
          width: "60%",
          backgroundColor: "rgba(43, 43, 43, 0.5)",
          display: "flex",
        }}
      >
        <Box>
          <CardMedia
            component="img"
            sx={{
              order: { xs: 1, sm: 2 },
              width: { xs: "50px", sm: "200px" },
              height: { xs: "50px", sm: "200px" },
              margin: "30px",
              objectFit: "cover",
              borderRadius: "5px",
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
            src={`${baseUrl}/events/thumbnail/${videoInfo?.event_image}`}
            alt={videoInfo?.event_image}
          />
        </Box>
        <Box>
          <Typography variant="h2" sx={{ ml: 0 }}>
            {videoInfo?.title}
          </Typography>
          <Typography variant="subtitle1" component="div">
            <b>Start Date:</b> {startDate.toDateString()}
          </Typography>
          <Typography variant="subtitle1" component="div">
            <b>End Date:</b> {endDate.toDateString()}
          </Typography>
          <Typography variant="subtitle1" component="div">
            <b>From:</b> {startDate.toLocaleTimeString()} - <b>To: </b>{" "}
            {endDate.toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: "60%", mb: 12 }}>
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        <Button
          variant="contained"
          sx={{ mt: 5, borderRadius: "0px" }}
          onClick={() => initChatBot()}
        >
          Start VideoChat
        </Button>

        {chatbotInitiated && (
          <Box sx={{ backgroundColor: "black", p: 3 }}>
            <VideoChat table_name={"video_2024_10_29_11_41_58"} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ViewingArchiveScreen;

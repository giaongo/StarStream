import React from "react";
import { Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import "../styles/App.css";
import Chat from "../components/Chat";
import VideoFLV from "../components/VideoFLV";

const ViewingScreen = () => {
  const location = useLocation();
  const event = location.state?.event;
  const viewing_url = location.state?.viewing_url.url;
  const startDate = new Date(event?.start_date);
  const endDate = new Date(event?.end_date);

  return (
    <Box component="section" sx={{ height: "100%", mt: 20 }}>
      <Box
        sx={{
          width: "30%",
          backgroundColor: "rgba(55, 58, 64, 0.6)",
          textAlign: "center",
          borderRadius: "10px 10px 0px 0px",
        }}
      >
        <Typography variant="h2" margin="0px">
          {event?.title.toUpperCase()}
        </Typography>
        <Typography variant="subtitle1" component="div" display="inline">
          <b>From:</b> {startDate.toLocaleTimeString()} - <b>To: </b>{" "}
          {endDate.toLocaleTimeString()}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          m: 4,
          mt: 0,
          marginBottom: { xs: "25px", md: "20px" },
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            flexBasis: "47%",
          }}
        >
          <VideoFLV
            option={{
              type: "flv",
              url: viewing_url,
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            marginLeft: { xs: "0px", md: "20px" },
            marginTop: { xs: "20px", md: "0px" },
            flexBasis: { xs: "100%", sm: "5%" },
            backgroundColor: "black",
            boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.5)",
            maxHeight: { xs: "550px", md: "990px" },
            overflow: "auto",
          }}
        >
          <Typography variant="h2" sx={{ marginTop: "10px" }}>
            Live Chat
          </Typography>
          <Chat eventId={event?.id} />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewingScreen;

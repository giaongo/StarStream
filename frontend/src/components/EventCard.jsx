import {
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
} from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import "../styles/Home.css";
import { useSelector } from "react-redux";
import { baseUrl } from "../utils/variables";

const EventCard = ({ isLive, event }) => {
  const user = useSelector((state) => state.user);
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        height: "40%",
        width: "80%",
        marginBottom: "50px",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        backgroundColor: isLive ? "liveBg" : "transparent",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          order: { xs: 2, sm: 1 },
        }}
      >
        <CardContent
          sx={{ flex: "1 0 auto", padding: "30px" }}
          className={!user.isAdmin ? "public" : ""}
        >
          <Typography variant="h3" component="div">
            {event.title.toUpperCase()}
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

          {user.isAdmin && (
            <>
              <Typography variant="subtitle2" component="div">
                Streaming status: {isLive ? "Live" : "Upcoming"}
              </Typography>
              <Typography variant="subtitle2" component="div">
                Streaming url: {event.streaming_url}
              </Typography>
              <Typography variant="subtitle2" component="div">
                Streaming key: {event.streaming_key}
              </Typography>
            </>
          )}

          <Box sx={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              disabled={!isLive}
              sx={{
                backgroundColor: isLive ? "liveBtn" : "upcomingBtn",
                "&.Mui-disabled": {
                  backgroundColor: "upcomingBtn", // Overrides default disabled background
                  color: "white", // Overrides default disabled text color
                },
              }}
            >
              {isLive ? "Watch Now" : "Upcoming"}
            </Button>
          </Box>
          {user.isAdmin && (
            <Box sx={{ marginTop: "10px" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "deleteBtn",
                  color: "black",
                  marginTop: "10px",
                }}
              >
                {" "}
                Delete
              </Button>
            </Box>
          )}
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        sx={{
          order: { xs: 1, sm: 2 },
          width: { xs: "50px", sm: "350px" },
          height: { xs: "50px", sm: "350px" },
          margin: "30px",
          objectFit: "cover",
          borderRadius: "5px",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
        src={`${baseUrl}/events/thumbnail/${event.event_image}`}
        alt={event.event_image}
      />
    </Card>
  );
};

EventCard.propTypes = {
  isLive: PropTypes.bool,
  event: PropTypes.object,
};

export default EventCard;

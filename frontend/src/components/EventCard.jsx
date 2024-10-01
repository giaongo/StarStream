import {
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "../styles/App.css";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../utils/variables";
import { EVENT_STATUS } from "../utils/dataTypes";
import { displayNotification } from "../reducers/notificationReducer";
import { useEvent } from "../hooks/ApiHooks";
import { deleteEventById } from "../reducers/eventReducer";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const user = useSelector((state) => state.user);
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const intervalRef = useRef(null);
  const statusStageRef = useRef(null);
  const [eventStatus, setEventStatus] = useState(EVENT_STATUS["Upcoming"]);
  const dispatch = useDispatch();
  const { deleteEvent, getViewingUrl } = useEvent();
  const navigate = useNavigate();

  /**
   * Compare current time with event start and end time. Set event status accordingly
   */
  const checkEventTime = () => {
    const currentTime = new Date();
    const millisecondDiffStart = startDate - currentTime;
    const millisecondDiffEnd = endDate - currentTime;

    if (millisecondDiffEnd <= 0) {
      console.log(`Event ${event.title} has ended`);
      clearInterval(intervalRef.current);
      if (
        !statusStageRef.current ||
        statusStageRef.current !== EVENT_STATUS["Ended"]
      ) {
        statusStageRef.current = EVENT_STATUS["Ended"];
        setEventStatus(EVENT_STATUS["Ended"]);
        dispatch(
          displayNotification(
            { message: `${event.title} ends live`, severity: "info" },
            3000
          )
        );
      }
    } else if (millisecondDiffStart <= 0 && millisecondDiffEnd > 0) {
      if (!statusStageRef.current) {
        statusStageRef.current = EVENT_STATUS["Live"];
        setEventStatus(EVENT_STATUS["Live"]);
        dispatch(
          displayNotification(
            { message: `${event.title} is live now!!!`, severity: "info" },
            3000
          )
        );
      }
    }
  };

  /**
   * Running checkEventTime in time interval every 1 second
   */
  const setTimeCheckingInterval = () => {
    intervalRef.current = setInterval(() => {
      checkEventTime();
    }, 1000);
  };

  /**
   * Handle status button click
   */
  const handleBtnClick = async () => {
    switch (eventStatus) {
      case EVENT_STATUS["Live"]:
        let viewing_url = "";
        try {
          viewing_url = await getViewingUrl(event.id);
        } catch (error) {
          console.error(error);
        }
        navigate(`/event/${event.id}`, { state: { event, viewing_url } });
        break;
      case EVENT_STATUS["Ended"]:
        console.log("ended btn is clicked");
        navigate("/archive");
        break;
      default:
        console.log("Anything else");
    }
  };

  useEffect(() => {
    setTimeCheckingInterval();

    // clean up when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (statusStageRef.current) {
        statusStageRef.current = null;
      }
    };
  }, []);

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
        backgroundColor:
          eventStatus === EVENT_STATUS["Live"] ? "liveBg" : "transparent",
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
          <Typography variant="h3" sx={{ paddingBottom: "5px" }}>
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
                <b>Streaming status:</b>{" "}
                {eventStatus === EVENT_STATUS["Upcoming"]
                  ? "Upcoming"
                  : eventStatus === EVENT_STATUS["Live"]
                  ? "Watch Now"
                  : "Ended"}
              </Typography>
              <Typography variant="subtitle2" component="div">
                <b>Streaming url:</b> {event.streaming_url}
              </Typography>
              <Typography variant="subtitle2" component="div">
                <b>Streaming key:</b> {event.streaming_key}
              </Typography>
            </>
          )}

          <Box sx={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              disabled={eventStatus === EVENT_STATUS["Upcoming"]}
              sx={{
                backgroundColor:
                  eventStatus === EVENT_STATUS["Upcoming"]
                    ? "upcomingBtn"
                    : eventStatus === EVENT_STATUS["Live"]
                    ? "liveBtn"
                    : "endedBtn",
                "&.Mui-disabled": {
                  backgroundColor: "upcomingBtn", // Overrides default disabled background
                  color: "white", // Overrides default disabled text color
                },
              }}
              onClick={async () => await handleBtnClick()}
            >
              {eventStatus === EVENT_STATUS["Upcoming"]
                ? "Upcoming"
                : eventStatus === EVENT_STATUS["Live"]
                ? "Watch Now"
                : "Ended"}
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
                onClick={() =>
                  dispatch(deleteEventById(user.token, event.id, deleteEvent))
                }
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
  event: PropTypes.object,
};

export default EventCard;

import React, { useEffect } from "react";
import { Typography, Container, Fab } from "@mui/material";
import EventCard from "../components/EventCard";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { useEvent } from "../hooks/ApiHooks";
import { displayNotification } from "../reducers/notificationReducer";

const HomeScreen = () => {
  const user = useSelector((state) => state.user);
  const { getEventToday } = useEvent();
  const dispatch = useDispatch();
  const [events, setEvents] = React.useState([]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const events = await getEventToday(user.token);
        setEvents(events.events);
        return events;
      } catch (error) {
        console.error(error);
        dispatch(
          displayNotification(
            { message: error.message, severity: "error" },
            3000
          )
        );
      }
    };
    getEvents();
  }, [user.isAdmin]);

  return (
    <>
      <Typography variant="h1" textAlign="center" sx={{ marginBottom: "50px" }}>
        {!user.isAdmin ? "EVENTS TODAY" : "ADMIN EVENT MONITOR"}
      </Typography>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {events.length === 0 ? (
          <Typography variant="h2" textAlign="center">
            No events found!
          </Typography>
        ) : (
          events.map((event) => (
            <EventCard key={event.id} isLive={true} event={event} />
          ))
        )}
      </Container>
      {user.isAdmin && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "addEventBtn",
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </>
  );
};

export default HomeScreen;

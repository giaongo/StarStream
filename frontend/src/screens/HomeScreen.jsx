import React, { useEffect } from "react";
import { Typography, Container, Fab, Box } from "@mui/material";
import EventCard from "../components/EventCard";
import Slider from "react-slick";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { useEvent } from "../hooks/ApiHooks";
import { displayNotification } from "../reducers/notificationReducer";
import { useNavigate } from "react-router-dom";
import { addEvents } from "../reducers/eventReducer";
import CarouselBanner from "../components/CarouselBanner";

const HomeScreen = () => {
  const user = useSelector((state) => state.user);
  const eventState = useSelector((state) => state.event);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getEventToday } = useEvent(navigate, dispatch);

  const settings = {
    dots: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handleFabBtnClick = () => {
    console.log("Fab button clicked");
    navigate("admin/addEvent");
  };

  useEffect(() => {
    const getEvents = async () => {
      try {
        const events = await getEventToday(user.token);
        dispatch(addEvents(events));
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
    console.log("Fetching events ", eventState.length);
  }, [user.token]);

  return (
    <Box>
      <CarouselBanner />
      <Typography variant="h1" textAlign="center" sx={{ marginBottom: "50px" }}>
        {!user.isAdmin ? "EVENTS TODAY" : "ADMIN EVENT MONITOR"}
      </Typography>
      <Container>
        {eventState.length < 0 ? (
          <Typography variant="h2" textAlign="center">
            No events found!
          </Typography>
        ) : eventState.length === 1 ? (
          eventState.map((event) => (
            <EventCard key={event.id} isLive={true} event={event} />
          ))
        ) : (
          <Slider {...settings}>
            {eventState.map((event) => (
              <EventCard key={event.id} isLive={true} event={event} />
            ))}
          </Slider>
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
          onClick={() => handleFabBtnClick()}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default HomeScreen;

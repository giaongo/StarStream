import React, { useEffect } from "react";
import { Typography, Container, Fab, Box, Button } from "@mui/material";
import EventCard from "../components/EventCard";
import Slider from "react-slick";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { useEvent } from "../hooks/ApiHooks";
import { displayNotification } from "../reducers/notificationReducer";
import { useNavigate } from "react-router-dom";
import { addEvents } from "../reducers/eventReducer";
import CarouselBanner from "../components/CarouselBanner";
import video_archives_photo from "../assets/video_archives_photo.jpg";
import live_chat_photo from "../assets/live_chat_photo.jpg";
import FeatureIntro from "../components/FeatureIntro";

const HomeScreen = () => {
  const user = useSelector((state) => state.user);
  const eventState = useSelector((state) => state.event);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getEventToday } = useEvent(navigate, dispatch);

  const settings = {
    dots: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
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
      <Typography variant="h1" textAlign="center">
        {!user.isAdmin ? "EVENTS TODAY" : "ADMIN EVENT MONITOR"}
      </Typography>
      <Container sx={{ mt: 10 }}>
        <Container>
          {eventState.length <= 0 ? (
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
      </Container>

      <FeatureIntro
        type="archive"
        photo={video_archives_photo}
        heading="Accessible Video Archives"
        title="Exploring Our Video Archives"
        body="Rewatch past events and catch up on what you missed!"
      />

      <FeatureIntro
        type="livechat"
        photo={live_chat_photo}
        heading="Interactive Live Chat"
        title="Engaging With The Live Events"
        body="Join the conversation and share your thoughts with other viewers!"
      />

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

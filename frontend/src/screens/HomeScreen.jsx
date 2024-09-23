import React from "react";
import { Typography, Container, Fab } from "@mui/material";
import PropTypes from "prop-types";
import EventCard from "../components/EventCard";
import AddIcon from "@mui/icons-material/Add";

const HomeScreen = ({ isAdmin }) => {
  return (
    <>
      <Typography variant="h1" textAlign="center">
        {!isAdmin ? "EVENTS TODAY" : "ADMIN EVENT MONITOR"}
      </Typography>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <EventCard isAdmin={true} isLive={true} />
        <EventCard isAdmin={true} isLive={false} />
        <EventCard isAdmin={false} isLive={false} />
      </Container>
      {isAdmin && (
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

HomeScreen.propTypes = {
  isAdmin: PropTypes.bool,
};

export default HomeScreen;

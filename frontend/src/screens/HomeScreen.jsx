import React, { useEffect } from "react";
import { Typography, Container, Fab } from "@mui/material";
import EventCard from "../components/EventCard";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";

const HomeScreen = () => {
  const user = useSelector((state) => state.user);

  useEffect(() => {}, []);

  return (
    <>
      <Typography variant="h1" textAlign="center">
        {!user.isAdmin ? "EVENTS TODAY" : "ADMIN EVENT MONITOR"}
      </Typography>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <EventCard isAdmin={user.isAdmin} isLive={true} />
        <EventCard isAdmin={user.isAdmin} isLive={false} />
        <EventCard isAdmin={user.isAdmin} isLive={false} />
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

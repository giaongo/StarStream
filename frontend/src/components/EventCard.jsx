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

const EventCard = ({ isAdmin, isLive }) => {
  return (
    <Card
      sx={{
        display: "flex",
        height: "30%",
        width: "60%",
        marginBottom: "50px",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        backgroundColor: isLive ? "liveBg" : "transparent",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent
          sx={{ flex: "1 0 auto", padding: "30px" }}
          className={!isAdmin ? "public" : ""}
        >
          <Typography variant="h3" component="div">
            InnoTrans 2024
          </Typography>
          <Typography variant="subtitle1" component="div">
            Date: 22/9/2024
          </Typography>
          <Typography variant="subtitle1" component="div">
            Time: 12 PM
          </Typography>

          {isAdmin && (
            <>
              <Typography variant="subtitle2" component="div">
                Streaming status: Active
              </Typography>
              <Typography variant="subtitle2" component="div">
                Streaming url: rtmp://streaming.com
              </Typography>
              <Typography variant="subtitle2" component="div">
                Streaming key: sample key
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
          {isAdmin && (
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
          width: "40%",
          margin: "30px",
          objectFit: "cover",
          borderRadius: "5px",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
        src="https://picsum.photos/200"
        alt="Live from space album cover"
      />
    </Card>
  );
};

EventCard.propTypes = {
  isAdmin: PropTypes.bool,
  isLive: PropTypes.bool,
};

export default EventCard;

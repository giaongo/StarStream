import React, { useState, useRef, useEffect } from "react";
import VideoArchive from "../components/VideoArchive";
import { Box, IconButton, Typography } from "@mui/material";
import { useSwipeable } from "react-swipeable";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import "../styles/App.css";
import PropTypes from "prop-types";

const ITEM_WIDTH = 350;

const VideoArchiveList = ({ videos, title }) => {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -ITEM_WIDTH, behavior: "smooth" });
      setScrollPosition(containerRef.current.scrollLeft - ITEM_WIDTH);
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const maxScrollLeft =
        containerRef.current.scrollWidth - containerRef.current.clientWidth;
      if (containerRef.current.scrollLeft < maxScrollLeft) {
        containerRef.current.scrollBy({
          left: ITEM_WIDTH,
          behavior: "smooth",
        });
        setScrollPosition(containerRef.current.scrollLeft + ITEM_WIDTH);
      }
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => scrollRight(),
    onSwipedRight: () => scrollLeft(),
    trackMouse: true,
  });

  return (
    <Box className="video-archive-container">
      <Box
        sx={{
          alignSelf: "flex-start",
          m: 0,
          pl: 5,
          pb: 5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h1" component="div" sx={{ m: 0, mr: 2 }}>
          {title}
        </Typography>
        <Box className="actions-btns">
          <IconButton
            className="btn-left"
            onClick={() => scrollLeft()}
            sx={{ p: 0, color: "white" }}
            disabled={scrollPosition <= 0}
          >
            <ArrowBackIosIcon sx={{ height: 40, width: 40 }} />
          </IconButton>
          <IconButton
            className="btn-right"
            onClick={() => scrollRight()}
            sx={{ p: 0, color: "white" }}
            disabled={
              scrollPosition >=
              containerRef.current?.scrollWidth -
                containerRef.current?.clientWidth
            }
          >
            <ArrowForwardIosIcon sx={{ height: 40, width: 40 }} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          width: "90%",
          overflowX: "hidden",
          scrollBehavior: "smooth",
        }}
        ref={containerRef}
      >
        <Box className="content-box" {...swipeHandlers}>
          {videos.map((video) => (
            <VideoArchive key={video.video_id} video={video} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

VideoArchiveList.propTypes = {
  videos: PropTypes.array,
  title: PropTypes.string,
};
export default VideoArchiveList;

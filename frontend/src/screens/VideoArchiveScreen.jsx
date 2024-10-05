import React from "react";
import { sample_data } from "../utils/variables";
import { Box } from "@mui/material";
import VideoArchiveList from "../components/VideoArchiveList";

const ITEM_WIDTH = 350;

const VideoArchiveScreen = () => {
  return (
    <Box>
      <VideoArchiveList videos={sample_data} title="Popular Stream" />
      <VideoArchiveList videos={sample_data} title="Latest Stream" />
    </Box>
  );
};

export default VideoArchiveScreen;

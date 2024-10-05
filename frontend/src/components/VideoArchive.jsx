import React from "react";
import Card from "@mui/material/Card";
import { CardMedia, CardContent, Typography, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const VideoArchive = ({ video }) => {
  return (
    <Card
      sx={{
        width: 350,
        height: 300,
        boxShadow:
          "0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 -10px 20px 0 rgba(0, 0, 0, 0.19)",
      }}
    >
      <CardMedia
        sx={{ height: 200 }}
        image="https://picsum.photos/200/300"
        title="Event Video"
      />
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography gutterBottom variant="h6">
          {video.title}
        </Typography>

        <IconButton aria-label="play" size="large">
          <PlayCircleOutlineIcon sx={{ height: 38, width: 38 }} />
        </IconButton>
      </CardContent>
    </Card>
  );
};

VideoArchive.propTypes = {
  video: PropTypes.object,
};

export default VideoArchive;

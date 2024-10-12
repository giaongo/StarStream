import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import flvjs from "flv.js";
import { Box } from "@mui/material";

const VideoFLV = ({ option }) => {
  const videoRef = useRef(null);
  let flvPlayer = null;

  useEffect(() => {
    if (flvjs.isSupported()) {
      flvPlayer = flvjs.createPlayer(option);
      flvPlayer.attachMediaElement(videoRef.current);
      flvPlayer.load();
      flvPlayer.play();
    }

    return () => {
      if (flvPlayer) {
        flvPlayer.destroy();
      }
    };
  }, [option]);

  return (
    <Box data-vjs-player sx={{ flex: 1 }}>
      <video
        ref={videoRef}
        controls
        style={{ width: "100%", height: "auto" }}
      />
    </Box>
  );
};

VideoFLV.propTypes = {
  option: PropTypes.object.isRequired,
};
export default VideoFLV;

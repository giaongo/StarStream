import React from "react";
import { AI_CHAT_TYPE, AIChatContent } from "../utils/dataTypes";
import { Box, Typography } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PropTypes from "prop-types";

const AIVideoChatContent = ({ chatContent }) => {
  return (
    <Box sx={{ mb: 1 }}>
      {chatContent.type === AI_CHAT_TYPE["Question"] ? (
        <Box
          sx={{
            backgroundColor: "lightgray",
            borderRadius: "10px",
            display: "inline-block",
            p: 1,
            mt: 1,
            mb: 1,
          }}
        >
          <Typography variant="body1" color="primary">
            {chatContent.data}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body1" color="secondary">
          <SmartToyIcon sx={{ mr: 2, mb: 0 }} /> {chatContent.data}
        </Typography>
      )}
    </Box>
  );
};

AIVideoChatContent.propTypes = {
  AIChatContent: PropTypes.object,
};
export default AIVideoChatContent;

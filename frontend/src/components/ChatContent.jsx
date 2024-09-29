import React from "react";
import PropTypes from "prop-types";
import { StyledBadge } from "../styles/CustomMaterialStyles";
import { ListItem, ListItemAvatar, Typography, Avatar } from "@mui/material";

const ChatContent = ({ content }) => {
  return (
    <ListItem alignItems="center">
      <ListItemAvatar sx={{ textAlign: "center" }}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar sx={{ width: 40, height: 40 }}>
            {content.message.name.charAt(0)}
          </Avatar>
        </StyledBadge>
      </ListItemAvatar>
      <Typography marginRight="10px" sx={{ fontSize: "1.2rem" }}>
        {content.message.name}:
      </Typography>
      <Typography sx={{ fontSize: "1.2rem" }}>
        {content.message.text}
      </Typography>
    </ListItem>
  );
};

ChatContent.propTypes = {
  content: PropTypes.object,
};
export default ChatContent;
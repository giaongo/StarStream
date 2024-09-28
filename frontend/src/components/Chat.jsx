import React, { useEffect, useState, useRef } from "react";
import socket from "socket.io-client";
import PropTypes from "prop-types";
import { baseUrl } from "../utils/variables";
import { styled } from "@mui/material/styles";

import {
  ListItem,
  Divider,
  ListItemText,
  Avatar,
  ListItemAvatar,
  Typography,
  List,
  Badge,
  Box,
  TextField,
  Fab,
  FormControl,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SendIcon from "@mui/icons-material/Send";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Chat = ({ eventId }) => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const socketClientRef = useRef();
  const client = socket(baseUrl, { autoConnect: false });
  const name = "Giao Ngo";
  const content = "This is a test";

  useEffect(() => {
    client.connect();
    client.emit("join", eventId);

    client.on("connect", () => {
      console.log("connected");
    });
    client.on("disconnect", () => {
      console.log("diconnected");
    });
    client.on("message", (message) => {
      console.log("received_message", message);
      setChats((prevChats) => [...prevChats, message]);
    });
    socketClientRef.current = client;

    return () => {
      client.emit("leave", eventId);
      client.removeAllListeners();
      client.disconnect();
    };
  }, []);

  const handleSend = async () => {
    socketClientRef.current.emit("message", {
      room: eventId,
      message,
    });
    setMessage("");
  };
  return (
    <>
      {/* <div>
        <h1>Messages</h1>
        {chats.map((chat, id) => (
          <div style={{ color: "white" }} key={id}>
            {chat.message}
          </div>
        ))}
      </div>
      <div>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={handleSend}>Send</button>
      </div> */}
      <List sx={{ width: "100%", color: "white", height: "80%" }}>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar>{name.charAt(0)}</Avatar>
            </StyledBadge>
          </ListItemAvatar>
          <Typography marginRight="10px" sx={{ fontSize: "0.8rem" }}>
            {name}:
          </Typography>
          <Typography sx={{ fontSize: "0.8rem" }}>{content}</Typography>
        </ListItem>
      </List>

      <Divider />
      <FormControl
        fullWidth
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          id="input-with-sx"
          label="Send something"
          variant="standard"
          multiline
          color="white"
          sx={{ flex: 1, margin: 0 }}
        />
        <Fab color="primary" aria-label="send" size="small" sx={{ ml: 2 }}>
          <SendIcon />
        </Fab>
      </FormControl>
    </>
  );
};

Chat.propTypes = {
  eventId: PropTypes.number,
};
export default Chat;

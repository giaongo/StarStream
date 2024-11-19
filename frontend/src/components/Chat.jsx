import React, { useEffect, useState, useRef } from "react";
import socket from "socket.io-client";
import PropTypes from "prop-types";
import { wsUrl } from "../utils/variables";
import { Divider, List, Fab, FormControl, Box, Container } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SendIcon from "@mui/icons-material/Send";
import {
  LiveTextField,
  NameChatTextField,
} from "../styles/CustomMaterialStyles";
import ChatContent from "./ChatContent";

const Chat = ({ eventId }) => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [chatName, setChatName] = useState("");
  const socketClientRef = useRef();
  const client = socket(wsUrl, { autoConnect: false });

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

  const handleSend = async (event) => {
    event.preventDefault();
    socketClientRef.current.emit("message", {
      room: eventId,
      message: {
        name:
          chatName.charAt(0).toUpperCase() + chatName.slice(1).toLowerCase() ||
          "Anonymous",
        text: message,
      },
    });
    setMessage("");
  };
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: "50%", md: "83%" },
      }}
    >
      <List
        sx={{
          color: "white",
          flex: 1,
          overflow: "auto",
        }}
      >
        {chats.map((chat, id) => (
          <ChatContent key={id} content={chat} />
        ))}
      </List>

      <FormControl>
        <NameChatTextField
          hiddenLabel
          id="name-chat-input"
          variant="filled"
          placeholder="Your name is: ..."
          value={chatName}
          onChange={(event) => setChatName(event.target.value)}
        />
      </FormControl>

      <Divider sx={{ backgroundColor: "lightGrey", mb: 1.5 }} />

      <Box component="form" onSubmit={handleSend}>
        <FormControl
          fullWidth
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AccountCircle sx={{ color: "white", m: 2 }} />

          <LiveTextField
            label="Send something..."
            id="chat-input"
            variant="standard"
            color="white"
            maxRows={2}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />

          <Fab
            type="submit"
            color="white"
            aria-label="send"
            size="small"
            sx={{
              m: 1,
            }}
          >
            <SendIcon />
          </Fab>
        </FormControl>
      </Box>
    </Container>
  );
};

Chat.propTypes = {
  eventId: PropTypes.number,
};
export default Chat;

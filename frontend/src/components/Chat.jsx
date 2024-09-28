import React, { useEffect, useState, useRef } from "react";
import socket from "socket.io-client";
import PropTypes from "prop-types";
import { baseUrl } from "../utils/variables";
import {
  ListItem,
  Divider,
  Avatar,
  ListItemAvatar,
  Typography,
  List,
  TextField,
  Fab,
  FormControl,
  FormLabel,
  Container,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SendIcon from "@mui/icons-material/Send";
import {
  LiveTextField,
  NameChatTextField,
  StyledBadge,
} from "../styles/CustomMaterialStyles";

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
    <Container sx={{ display: "flex", flexDirection: "column", height: "90%" }}>
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
      <List sx={{ color: "white", flex: 1 }}>
        <ListItem alignItems="center">
          <ListItemAvatar sx={{ textAlign: "center" }}>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar sx={{ width: 40, height: 40 }}>{name.charAt(0)}</Avatar>
            </StyledBadge>
          </ListItemAvatar>
          <Typography marginRight="10px" sx={{ fontSize: "1.2rem" }}>
            {name}:
          </Typography>
          <Typography sx={{ fontSize: "1.2rem" }}>{content}</Typography>
        </ListItem>
      </List>

      <FormControl>
        {/* <TextField
          hiddenLabel
          id="filled-hidden-label-small"
          defaultValue="Small"
          variant="filled"
          size="small"
          placeholder="Please enter your name:"
          sx={{
            backgroundColor: "#424242",
            borderRadius: "0 5px 5px 0",
          }}
        /> */}
        <NameChatTextField
          hiddenLabel
          id="name-chat-input"
          variant="filled"
          placeholder="Please enter your name"
        />
      </FormControl>

      <Divider sx={{ backgroundColor: "lightGrey", mb: 1.5 }} />

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
        />

        <Fab
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
    </Container>
  );
};

Chat.propTypes = {
  eventId: PropTypes.number,
};
export default Chat;

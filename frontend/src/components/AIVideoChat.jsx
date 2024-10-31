import React, { useEffect, useRef, useState } from "react";
import { videoChatBaseUrl } from "../utils/variables";
import {
  Fab,
  FormControl,
  Box,
  Container,
  List,
  Divider,
  Typography,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SendIcon from "@mui/icons-material/Send";
import { LiveTextField } from "../styles/CustomMaterialStyles";
import { AI_CHAT_TYPE, AIChatContent } from "../utils/dataTypes";
import PropTypes from "prop-types";
import AIVideoChatContent from "./AIVideoChatContent";
import LoadingDots from "./LoadingDots";

const AIVideoChat = ({ table_name }) => {
  const [chats, setChats] = useState([]);
  const [question, setQuestion] = useState("");
  const [loadingDots, setLoadingDots] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket(
      `ws://${videoChatBaseUrl}/video/ws/${table_name}`
    );

    wsRef.current.onopen = () => {
      console.log("Connected to video chat server");
    };
    wsRef.current.onmessage = (event) => {
      setLoadingDots(false);
      setChats((prevMessage) => [
        ...prevMessage,
        new AIChatContent(AI_CHAT_TYPE["Answer"], event.data),
      ]);
    };

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  // Send question message to AI
  const handleSend = async (event) => {
    event.preventDefault();
    try {
      wsRef.current.send(question);
      setChats((prevMessage) => [
        ...prevMessage,
        new AIChatContent(AI_CHAT_TYPE["Question"], question),
      ]);
      setQuestion("");
      setLoadingDots(true);
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <Container
      sx={{
        backgroundColor: "transparent",
        height: "500px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {chats.length <= 0 && (
        <Typography variant="h6" sx={{ color: "white", mt: 1 }}>
          This AI assistant is here to help you understand the content of the
          video above. Please ask in the chat box below.
        </Typography>
      )}

      <List
        sx={{
          color: "white",
          flex: 1,
          overflow: "auto",
          height: "70%",
        }}
      >
        {chats.map((chat, id) => (
          <Box key={id}>
            <AIVideoChatContent chatContent={chat} />
            {id === chats.length - 1 && loadingDots && <LoadingDots />}
          </Box>
        ))}
      </List>
      <Divider sx={{ backgroundColor: "lightGrey", mb: 1.5 }} />
      <Box component="form" onSubmit={handleSend} sx={{}}>
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
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
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

AIVideoChat.propTypes = {
  table_name: PropTypes.string,
};
export default AIVideoChat;

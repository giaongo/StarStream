import React, { useEffect, useState, useRef } from "react";
import socket from "socket.io-client";
import PropTypes from "prop-types";

const Chat = ({ eventId }) => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const socketClientRef = useRef();
  const client = socket("http://localhost:5001", { autoConnect: false });

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
    <div>
      <div>
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
      </div>
    </div>
  );
};

Chat.propTypes = {
  eventId: PropTypes.number,
};
export default Chat;

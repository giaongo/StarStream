import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const socket = io("ws://localhost:5001");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("message", (data) => {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    const message = document.getElementById("message");
    socket.send(message.value);
  };

  return (
    <div>
      <input
        type="text"
        name="message"
        id="message"
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;

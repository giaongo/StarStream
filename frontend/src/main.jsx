import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer.js";
import { Provider } from "react-redux";
import userReducer from "./reducers/userReducer.js";
import eventReducer from "./reducers/eventReducer.js";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    user: userReducer,
    event: eventReducer,
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

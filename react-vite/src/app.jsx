import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import configureStore from "./redux/store";
import { router } from "./router";
import * as sessionActions from "./redux/session";
import { createChannelThunk } from "./redux/channels";
import "./index.css";
import { io } from "socket.io-client";

export const socket = io(
  import.meta.env.NODE_ENV === "production"
    ? 'https://hypercomm.onrender.com'
    : "http://localhost:8000"
);

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
  window.createChannelThunk = createChannelThunk;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  </React.StrictMode>
);

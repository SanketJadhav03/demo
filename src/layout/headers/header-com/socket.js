// src/socket.js
import { IMG_URL } from "@/url_helper";
import { io } from "socket.io-client";

const socket = io(IMG_URL, {
  transports: ["websocket"],
});

export default socket;

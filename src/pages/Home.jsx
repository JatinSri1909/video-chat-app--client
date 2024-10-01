import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const handleRoomJoined = useCallback(
    ({ room }) => {
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    console.log("Setting up socket listeners in Home");
    socket.on("joined-room", handleRoomJoined);
    return () => {
      console.log("Cleaning up socket listeners in Home");
      socket.off("joined-room", handleRoomJoined);
    };
  }, [socket, handleRoomJoined]);

  const handleJoinRoom = () => {
    console.log("Joining room with email:", email, "and room:", room);
    socket.emit("join-room", { room, email });
  };

  return (
    <div className="homepage-container">
      <div className="input-container">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email here...."
        />
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          type="text"
          placeholder="Enter Room "
        />
        <button onClick={handleJoinRoom}>Join</button>
      </div>
    </div>
  );
};

export default Home;

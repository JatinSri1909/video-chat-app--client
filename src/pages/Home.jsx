import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [emailId, setEmailId] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleRoomJoined = useCallback(
    ({ roomId }) => {
      navigate(`/room/${roomId}`);
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
    console.log("Joining room with email:", emailId, "and roomId:", roomId);
    socket.emit("join-room", { roomId, emailId });
  };

  return (
    <div className="homepage-container">
      <div className="input-container">
        <input
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          type="email"
          placeholder="Enter your email here...."
        />
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          placeholder="Enter Room Id"
        />
        <button onClick={handleJoinRoom}>Join</button>
      </div>
    </div>
  );
};

export default Home;

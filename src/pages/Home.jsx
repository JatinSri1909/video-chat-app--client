import React, { useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [emailId, setEmailId] = useState();
  const [roomId, setRoomId] = useState();

  const handleRoomJoined = ({ roomId}) => {
    navigate(`/room/${roomId}`);
  }

  useEffect(() => {
    socket.on("joined-room", handleRoomJoined);
  }, [socket]);

  const handleJoinRoom = () => {
    socket.emit("join-room", { roomId, emailId });
  }

  return (
    <div className="homepage-container">
      <div className="input-container">
        <input value={emailId} onChange={e => setEmailId(e.target.value)} type="email" placeholder="Enter your email here...." />
        <input value={roomId} onChange={e => setRoomId(e.target.value)} type="text" placeholder="Enter Room Id" />
        <button onClick={handleJoinRoom}>Join</button>
      </div>
    </div>
  );
};

export default Home;

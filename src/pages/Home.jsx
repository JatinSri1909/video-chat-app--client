import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="homepage-container">
      <div className="input-container">
        <form onSubmit={handleSubmitForm}>
          <label htmlFor="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            id="email"
            placeholder="Enter your email here...."
          />
          <label htmlFor="room">Room Number</label>
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            type="text"
            id="room"
            placeholder="Enter Room "
          />
          <button onClick={handleJoinRoom}>Join</button>
        </form>
      </div>
    </div>
  );
};

export default Home;

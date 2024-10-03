import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [socket, email, room]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("join:room", handleJoinRoom);
    return () => {
      socket.off("join:room", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email Id: </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label htmlFor="room">Room Id: </label>
        <input
          type="text"
          id="room"
          name="room"
          placeholder="1234"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          required
        />
        <br />
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};

export default Lobby;

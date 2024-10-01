import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../providers/Socket";
import { peer } from "../providers/Peer";
const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const handleUserJoined = useCallback(({ email, id}) => {
    console.log(`User ${email} joined the room`);
    setRemoteSocketId(id);
  }, []);

  return (
    <div className="room-container">
      <div className="player-container">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
          controls
          playing
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default Room;

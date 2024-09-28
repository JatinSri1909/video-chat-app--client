import React, { useEffect, useCallback } from "react";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";

const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAns } = usePeer();

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("User", emailId, "joined the room");
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(async(data) => {
    const { from, offer } = data;
    console.log("Incoming call from", from, offer);
    const ans = await createAnswer(offer);
    socket.emit("call-accepted", { emailId: from, ans });
  }, [createAnswer ,socket]);

  const handleCallAccepted = useCallback(async(data) => {
    const { from, ans } = data;
    console.log("Call accepted from", from, ans);
    await setRemoteAns(ans);
  }, [setRemoteAns]);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted]);

  return (
    <div className="room-page-container">
      <h1>Room</h1>
    </div>
  );
};

export default Room;

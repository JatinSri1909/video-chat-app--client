import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";

const Room = () => {
  const { socket } = useSocket();
  const { createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer();

  const [myStream, setMyStream] = useState(null);

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("User", emailId, "joined the room");
      try {
        const offer = await createOffer();
        console.log("Created offer:", offer);
        socket.emit("call-user", { emailId, offer });
        console.log("Emitted call-user event with offer");
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("Incoming call from", from, "with offer", offer);
      try {
        const ans = await createAnswer(offer);
        console.log("Created answer:", ans);
        socket.emit("call-accepted", { emailId: from, ans });
        console.log("Emitted call-accepted event with answer");
      } catch (error) {
        console.error("Error creating answer:", error);
      }
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { from, ans } = data;
      console.log("Call accepted from", from, "with answer", ans);
      try {
        await setRemoteAns(ans);
        console.log("Set remote answer");
        await sendStream(myStream);
      } catch (error) {
        console.error("Error setting remote answer:", error);
      }
    },
    [setRemoteAns, sendStream, myStream]
  );

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
  }, []);

  useEffect(() => {
    console.log("Setting up socket listeners in Room");
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      console.log("Cleaning up socket listeners in Room");
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAccepted]);

  useEffect(() => {
    console.log("Component mounted");
    return () => {
      console.log("Component unmounted");
    };
  }, []);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <div className="room-page-container">
      <h1>Room</h1>
      <button onClick={(e) => sendStream(myStream)}>Send Stream</button>
      <ReactPlayer url={myStream} playing />
      <ReactPlayer url={remoteStream} playing />
    </div>
  );
};

export default Room;

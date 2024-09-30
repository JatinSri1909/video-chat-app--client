import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";

const Room = () => {
  const { socket } = useSocket();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream,
  } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("User", emailId, "joined the room");
      try {
        await sendStream(myStream);
        const offer = await createOffer();
        console.log("Created offer:", offer);
        socket.emit("call-user", { emailId, offer });
        console.log("Emitted call-user event with offer");
        setRemoteEmailId(emailId);
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    },
    [createOffer, socket, sendStream, myStream]
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
        setRemoteEmailId(from);
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
      } catch (error) {
        console.error("Error setting remote answer:", error);
      }
    },
    [setRemoteAns]
  );

  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log("Obtained user media stream");
    } catch (error) {
      console.error("Error obtaining user media stream:", error);
    }
  }, []);

  const handleNegotiationNeeded = useCallback(async () => {
    const localOffer = await peer.localDescription;
    socket.emit("call-user", { emailId: remoteEmailId, offer: localOffer });
  }, [peer.localDescription, remoteEmailId, socket]);

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
    peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
    };
  }, [peer, handleNegotiationNeeded]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <div className="room-page-container">
      <h1>Room</h1>
      <h2>You are connected to: {remoteEmailId}</h2>
      <button onClick={(e) => sendStream(myStream)}>Send Stream</button>
      <ReactPlayer url={myStream} playing muted />
      <ReactPlayer url={remoteStream} playing />
    </div>
  );
};

export default Room;

import React, { useEffect, useCallback } from 'react'
import { useSocket } from '../providers/Socket'
import { usePeer } from '../providers/Peer';

const Room = () => {

    const { socket } = useSocket();
    const { peer, createOffer } = usePeer();

    const handleNewUserJoined = useCallback(async(data) => {
        const { emailId } = data;
        console.log("User", emailId, "joined the room");
        const offer = await createOffer();
        socket.emit("call-user", { emailId, offer });
    }, [createOffer, socket]);

    useEffect(() => {
        socket.on('user-joined', handleNewUserJoined);
        return () => {
            socket.off('user-joined', handleNewUserJoined);
        };
    }, [socket, handleNewUserJoined]);

  return (
    <div className='room-page-container'>
      <h1>Room</h1>
    </div>
  )
}

export default Room

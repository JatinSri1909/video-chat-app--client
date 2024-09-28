import React, { useEffect } from 'react'
import { useSocket } from '../providers/Socket'

const Room = () => {

    const { socket } = useSocket();

    const handleNewUserJoined = (data) => {
        const { emailId } = data;
        console.log("User", emailId, "joined the room");
    }

    useEffect(() => {
        socket.on('user-joined', handleNewUserJoined);
    }, [socket]);

  return (
    <div className='room-page-container'>
      <h1>Room</h1>
    </div>
  )
}

export default Room

import React, { useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = React.createContext(null);

const host = "http://localhost:8080";

export const useSocket = () => {
  const socket = React.useContext(SocketContext)
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => io(host), []);

  return (
      <SocketContext.Provider value={ socket }>
        {props.children}
      </SocketContext.Provider>
  );
};

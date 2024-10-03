import { io } from "socket.io-client";
import React, { useMemo } from "react";

const host = process.env.REACT_APP_HTTP_HOST ||"http://localhost:8080";

export const SocketContext = React.createContext(null);

export const useSocket = () => {
  const socket = React.useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => io("http://localhost:8080"), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};

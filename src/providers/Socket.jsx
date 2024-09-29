import React, { useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = React.createContext(null);

const host = process.env.HOST || "http://localhost:5000";

export const useSocket = () => {
  return React.useContext(SocketContext);
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => io(host), []);

  return (
    <div>
      <SocketContext.Provider value={{ socket }}>
        {props.children}
      </SocketContext.Provider>
    </div>
  );
};

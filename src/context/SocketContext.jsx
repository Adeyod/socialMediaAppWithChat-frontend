import { createContext, useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import io from 'socket.io-client';
import { socketRoute } from '../Components/ApiRoutes';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const socket = io(socketRoute, {
      query: {
        userId: user?.user?._id,
      },
    });
    setSocket(socket);

    socket.on('getOnlineUsers', (users) => {
      setOnlineUsers(users);
    });

    return () => socket && socket.close();
  }, [user?.user?._id]);

  console.log('onlineUsers:', onlineUsers);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.jsx';

const socketInstance = React.createContext();

export function useSocket() {
    return useContext(socketInstance);
}


export function SocketProvider({ id, children }) {
    const [socket, setSocket] = useState();
    const [user, setUser] = useLocalStorage('user', null);

    useEffect(() => {
        const newSocket = io('http://localhost:8000', {
            query: { id },
        });
        setSocket(newSocket);

        return () => newSocket.close();
    }, [id]);

    const value = {
        socket,
        user,
        setUser,
    };

    return (
        <socketInstance.Provider value={value}>
            {children}
        </socketInstance.Provider>
    );
}


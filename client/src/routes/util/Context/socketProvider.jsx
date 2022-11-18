import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.jsx';
import io from 'socket.io-client';

const socketInstance = React.createContext();

export function useSocket() {
    return useContext(socketInstance);
}


export function SocketProvider({ children }) {
    // const [socket, setSocket] = useState();
    let socket = null
    const [user, setUser] = useLocalStorage('user', null);

    useEffect(() => {
        const newSocket = io.connect("localhost:8000", { reconnect: true })
        socket = newSocket

        return () => newSocket.close();
    }, [socket]);

    function emitSocket(event, data) {
        try {
            socket.emit(event, data);
        } catch (error) {
            console.error(error);
        }

    }

    const value = {
        socket,
        user,
        setUser,
        emitSocket
    };

    return (
        <socketInstance.Provider value={value}>
            {children}
        </socketInstance.Provider>
    );
}


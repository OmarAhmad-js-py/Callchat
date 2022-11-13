import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.jsx';
import socket from '../hooks/socketInstance.jsx';

const socketInstance = React.createContext();

export function useSocket() {
    return useContext(socketInstance);
}





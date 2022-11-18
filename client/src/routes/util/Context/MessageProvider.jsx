
import React, { useContext, useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.jsx';
import socket from '../hooks/socketInstance.jsx';

const ConversationsContext = React.createContext()

export function useConversations() {
    return useContext(ConversationsContext)
}

export function ConversationsProvider({ id, children }) {
    const [conversations, setConversations] = useLocalStorage('conversations', [])
    const [selectedConversationIndex, setSelectedConversationIndex] = useState(0)

    function createConversation(recipients) {
        socket.emit('room', id)
        socket.on('payload', (room) => {
            setConversations(prevConversations => {
                let newMessage = {
                    recipients: [room],
                    messages: [{ text: 'Hello', FromMe: false }]
                }
                return [...prevConversations, newMessage]
            })
        })
    }

    createConversation()



    const addMessageToConversation = useCallback(({ recipients, text, sender }) => {
        setConversations(prevConversations => {
            let madeChange = false
            const newMessage = { sender, text }
            return [
                ...prevConversations,
                { recipients, messages: [newMessage] }
            ]

        })
    }, [setConversations])

    //formattedConversations 
    const formattedConversations = conversations.map((conversation, index) => {
        const messages = conversation.messages.map(message => {
            const fromMe = socket.id === message.sender.sender
            return {
                ...message,
                FromMe: fromMe
            }
        })
        return { messages }
    })
    useEffect(() => {
        if (socket == null) return
        socket.on('receive-message', addMessageToConversation)
        return () => socket.off('receive-message')
    }, [socket, addMessageToConversation])

    function sendMessage(sender, text) {
        socket.emit('Send_message', { sender, text })
        addMessageToConversation({ text, sender })
    }



    const value = {
        conversations: formattedConversations,
        sendMessage,
    }

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    )
}

function arrayEquality(a, b) {
    if (a.length !== b.length) return false

    a.sort()
    b.sort()

    return a.every((element, index) => {
        return element === b[index]
    })
}

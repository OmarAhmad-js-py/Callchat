
import React, { useContext, useState, useEffect, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { socket } from '../routes/util/hooks/socketInstance';

const ConversationsContext = React.createContext()

export function useConversations() {
    return useContext(ConversationsContext)
}

export function ConversationsProvider({ id, children }) {
    const [conversations, setConversations] = useLocalStorage('conversations', [])


    const addMessageToConversation = useCallback(({ recipients, text, sender }) => {
        setConversations(prevConversations => {
            let madeChange = false
            const newMessage = { sender, text }
            const newConversations = prevConversations.map(conversation => {
                if (arrayEquality(conversation.recipients, recipients)) {
                    madeChange = true
                    return {
                        ...conversation,
                        messages: [...conversation.messages, newMessage]
                    }
                }

                return conversation
            })

            if (madeChange) {
                return newConversations
            } else {
                return [
                    ...prevConversations,
                    { recipients, messages: [newMessage] }
                ]
            }
        })
    }, [setConversations])


    const formattedConversations = conversations.map((conversation, index) => {
        const messages = conversation.messages.map(message => {
            const contact = contacts.find(contact => {
                return contact.id === message.sender
            })
            const name = (contact && contact.name) || message.sender
            const fromMe = id === message.sender
            return { ...message, senderName: name, fromMe }
        })

        const selected = index === selectedConversationIndex
        return { ...conversation, messages, recipients, selected }
    })


    useEffect(() => {
        if (socket == null) return

        socket.on('receive-message', addMessageToConversation)

        return () => socket.off('receive-message')
    }, [socket, addMessageToConversation])

    function sendMessage(recipients, text) {
        socket.emit('send-message', { recipients, text })

        addMessageToConversation({ text, sender: id })
    }



    const value = {
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

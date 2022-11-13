/* eslint-disable no-unused-vars */
import React from 'react'
import { useState, useEffect, useRef, useCallback } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from "@fortawesome/free-solid-svg-icons";
import socket from '../routes/util/hooks/socketInstance';
import { useConversations } from '../routes/util/Context/MessageProvider.jsx';

function SidebarComponent(props) {
    const { open } = props;
    const [text, setText] = useState('')
    const [messages, setMessages] = useState([])
    const setRef = useCallback(node => {
        if (node) {
            node.scrollIntoView({ smooth: true })
        }
    }, [])
    const { sendMessage, conversations } = useConversations()

    function handleSubmit() {

        sendMessage(
            { sender: socket.id },
            text
        )
        setText('')
    }
    useEffect(() => {
        const messages = conversations.map((conversation) => {
            return conversation.messages
        })
        setMessages(messages)
    }, [conversations])






    return (<>
        <div className="yt-overlay" style={{ display: open ? 'block' : 'none' }}>
            <section className="chatbox">
                <section className="chat-window">
                    {messages.map((message, i) => {
                        //check if it is the last message
                        const lastMessage = messages.length - 1 === i
                        return (
                            <article ref={lastMessage ? setRef : null} className={message[0].FromMe ? "msg-container msg-self" : "msg-container msg-remote"} >
                                <div className="msg-box" key={i}>
                                    <div className="flr">
                                        <div className="messages">
                                            <p className="msg">
                                                {message[0].text}
                                            </p>
                                        </div>
                                        <span className="info">
                                            <span className="username">
                                                <u>You</u>
                                            </span>
                                        </span>
                                    </div>
                                    <img className="user-img" src="https://sothis.es/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png" alt="" />
                                </div>
                            </article >
                        )
                    })}

                </section>
                <div className="chat-input" >
                    <input
                        type="text"
                        onChange={e => setText(e.target.value)}
                        value={text}
                        placeholder="Type a message"
                        aria-label="Enter a message here to chat in your room"
                        maxLength="255"
                        autoComplete="off"
                    />
                    <button
                        className="bg-primary-600 "
                        onClick={() => handleSubmit()}
                        aria-label="Click here to send message"
                        tabIndex="0"
                    >
                        <FontAwesomeIcon icon={faShare} size='lg' />
                    </button>
                </div>
            </section >
        </div >
    </>
    )


}

export default SidebarComponent
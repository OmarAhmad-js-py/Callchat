/* eslint-disable no-unused-vars */
import React from 'react'
import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from "@fortawesome/free-solid-svg-icons";
import socket from '../routes/util/hooks/socketInstance';
import { useLocalStorage } from '../routes/util/hooks/useLocalStorage';
import { useNavigate } from "react-router-dom";
function SidebarComponent(props) {
    const socketRef = useRef();
    const navigate = useNavigate();
    const [message, setMessage] = useLocalStorage("message", "");
    const finalMessage = []
    const { open } = props

    const sendMessage = () => {
        socket.emit('Send_message', { message: message, sender: socket.id });
        setMessage("");
        console.log(finalMessage)

    };

    const Receiver = () => {
        socket.off("create message").on("create message", (message) => {
            console.log(message)
        });
    }
    Receiver()

    const handleChange = event => {
        const userMessage = JSON.stringify(event.target.value);
        setMessage(event.target.value);
    };




    return (<>
        <div className="yt-overlay" style={{ display: open ? 'block' : 'none' }}>
            <section className="chatbox">
                <section className="chat-window">
                    {finalMessage.map((message, index) => {
                        return <div className="msg-box">
                            <div className="flr">
                                <div className="messages">
                                    <p className="msg">
                                        {finalMessage}
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
                    })
                    }
                </section>
                <div className="chat-input" >
                    <input
                        type="text"
                        onChange={handleChange}
                        value={message}
                        placeholder="Type a message"
                        aria-label="Enter a message here to chat in your room"
                        maxLength="255"
                        autoComplete="off"
                    />
                    <button
                        className="bg-primary-600 "
                        onClick={() => sendMessage()}
                        aria-label="Click here to send message"
                        tabIndex="0"
                    >
                        <FontAwesomeIcon icon={faShare} size='lg' />
                    </button>
                </div>
            </section>
        </div>
    </>
    )


}

export default SidebarComponent
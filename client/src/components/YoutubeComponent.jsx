/* eslint-disable no-unused-vars */
import React from 'react'
import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from "@fortawesome/free-solid-svg-icons";
import socket from '../routes/util/socketInstance';
import { useNavigate } from "react-router-dom";
function SidebarComponent(props) {
    const socketRef = useRef();
    const navigate = useNavigate();
    const {open} = props

    const sendMessage = () => {
        console.log(socket.id)
        socket.emit("Send_message", {
            message: "Hello everyone!",
            sender: socket.id,
    })};
    
    
    socket.on("create message", (message) => {
            console.log(message);
    });

   

    return (<>
        <div className="yt-overlay" style={{display: open ? 'block' : 'none'}}>
            <section className="chatbox">
                <section className="chat-window">
                    
                </section>
                <div className="chat-input" >
                    <input
                        type="text"
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
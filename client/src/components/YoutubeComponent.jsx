/* eslint-disable no-unused-vars */
import React from 'react'
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
function SidebarComponent(props) {
    const {open} = props;
    const navigate = useNavigate();

    useEffect(() => {
        //connect to a socket io room 
                


    });

    return (<>
        <div className="yt-overlay" style={{display: open? "block" : "none"}}>
            <section className="chatbox">
                <section className="chat-window" ></section>
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
                        type="submit"
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
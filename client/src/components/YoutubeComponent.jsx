import React from 'react';
import { useState, useEffect, useRef, useCallback } from "react";
import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import socket from '../routes/util/hooks/socketInstance';

export default function YoutubeComponent() {
    //const { Search } = props;
    const [video, setVideo] = useState("")
    const [videoState, setvideoState] = useState(0)


    const onPlayerReady = (event) => {
        console.log(event.target)
    }

    socket.on("youtID", (data) => {
        console.log(data)
        setVideo(data)
    });
    console.log(video)

    socket.on("play", () => {
        setvideoState(1)
    })
    const sendplay = () => {
        console.log("played")
        socket.emit("play")
    }

    const opts = {
        playerVars: {
            autoplay: videoState,
            modestbranding: 1,
            rel: 1,

        },
    };
    return (<>

        <YouTube videoId={video} onPlay={() => sendplay()} opts={opts} onPause={onPlayerReady} />

    </>
    )
}
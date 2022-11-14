
import React, { useEffect, useRef, useState } from 'react';
import "./Createroom.css";
import "../assets/ytComp.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, useParams } from "react-router-dom";
import socket from './util/hooks/socketInstance';
import {
    faBars,
    faComments,
    faHome,
    faMicrophone,
    faMicrophoneSlash,
    faPhoneSlash, faTimes, faUser,
    faVideo,
    faVideoSlash
} from "@fortawesome/free-solid-svg-icons";




function Room() {
    const [audio, setAudio] = useState(true);
    const [video, setVideo] = useState(true);
    const [audioMax, setAudioMax] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();


    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio, video }).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;
            const audioContext = new AudioContext();
            const Analyser = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser(stream);
            const microphone = audioContext.createMediaStreamSource(stream);
            const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 2048;

            microphone.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);
            scriptProcessor.onaudioprocess = () => {
                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                const arraySum = array.reduce((a, value) => a + value, 0);
                const average = arraySum / array.length;
                colorPids(average);
            };

            function colorPids(vol) {
                const allPids = [...document.querySelectorAll('.pid')];
                const numberOfPidsToColor = Math.round(vol / 10);
                const pidsToColor = allPids.slice(0, numberOfPidsToColor);
                setAudioMax(vol > 95);
                for (const pid of allPids) {
                    pid.style.backgroundColor = "#e6e7e8";
                }
                for (const pid of pidsToColor) {
                    pid.style.backgroundColor = "#69ce3b";
                }
            }


            socket.emit("join room", params.roomID);

            socket.on('other user', userID => {
                callUser(userID);
                otherUser.current = userID;
            });

            socket.on("user joined", userID => {
                otherUser.current = userID;
            });

            socket.on("offer", handleReceiveCall);

            socket.on("answer", handleAnswer);

            socket.on("ice-candidate", handleNewICECandidateMsg);
        });

    }, []);



    function callUser(userID) {
        peerRef.current = createPeer(userID);
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    }

    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    }


    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socket.id,
                sdp: peerRef.current.localDescription
            };
            socket.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleReceiveCall(incoming) {
        peerRef.current = createPeer();
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socket.id,
                sdp: peerRef.current.localDescription
            }
            socket.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socket.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    function handleTrackEvent(e) {
        partnerVideo.current.srcObject = e.streams[0];
    }


    const toggleAudio = () => {
        if (audio === false) {
            const audioTracks = userStream.current.getTracks().find(track => track.kind === "audio");
            // audioTracks.enabled = audioTracks.enabled;
            setAudio(true);
        } else {
            const audioTracks = userStream.current.getTracks().find(track => track.kind === "audio");
            audioTracks.enabled = !audioTracks.enabled;
            setAudio(false);
        }

    };

    const toggleVideo = () => {
        if (video === true) {
            setVideo(false);
        } else {
            setVideo(true);
        }

    };

    const hangUp = () => {
        userStream.current.getTracks().forEach(track => track.stop());
        peerRef.current.close();
    };





    return (
        <>
            <div className="main">
                <div className="webcam-section">
                    <div className="userBorder">
                        <section className="partner-video">
                            <video autoPlay ref={partnerVideo} />
                        </section>
                    </div>
                    <div className="userBorder">
                        <section className="user-video">
                            <video autoPlay ref={userVideo} />
                        </section>
                        <div className="pids-wrapper">
                            <div className="pid" />
                            <div className="pid" />
                            <div className="pid" />
                            <div className="pid" />
                            <div className="pid" />
                            <div className="pid" />
                            <div className="pid" />
                            <div className="pid" />
                            <div className="pid" />
                            <div className="pid" />
                        </div>
                    </div>
                </div>
                <ScreamComponent open={audioMax} />
                <div className="controllpanel">
                    <div className="btn" style={{
                        backgroundColor: audio ? '#4CAF50' : 'grey'
                    }} onClick={toggleAudio}>
                        <FontAwesomeIcon icon={audio ? faMicrophone : faMicrophoneSlash} size="lg" />
                    </div>
                    <div className="btn" style={{ backgroundColor: "red" }} onClick={hangUp}>
                        <FontAwesomeIcon icon={faPhoneSlash} size="lg" />
                    </div>
                    <div className="btn" style={{
                        backgroundColor: video ? '#4CAF50' : 'grey'
                    }} onClick={toggleVideo}>
                        <FontAwesomeIcon icon={video ? faVideo : faVideoSlash} size="lg" />
                    </div>
                </div>
            </div>
        </>
    );
}

function ScreamComponent(props) {
    const { open } = props;
    return (<>
        {open ?
            <div className="scream-Modal">
                Stop Screaming
            </div>
            : <></>
        }

    </>)

}

export default Room;

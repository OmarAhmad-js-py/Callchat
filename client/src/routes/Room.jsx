
import React, { useEffect, useRef, useState } from 'react';
import "../assets/MsgStyles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, useParams } from "react-router-dom";
import socket from './util/hooks/socketInstance';
import { useLocalStorage } from './util/hooks/useLocalStorage';
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
    const [partner, setPartner] = useState(false);
    const [audio, setAudio] = useState(true);
    const [video, setVideo] = useState(true);
    const [audioMax, setAudioMax] = useState(false);
    const [socketInstanceID, setSocketInstanceID] = useLocalStorage("sockeID", [])
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
            };



            socket.emit("join room", params.roomID);

            socket.on('other user', userID => {
                callUser(userID);
                otherUser.current = userID;
            });

            socket.on("user joined", userID => {
                otherUser.current = userID;
            });

            socket.on("user left", userID => {
                setPartner(false);
            });

            socket.on("offer", handleReceiveCall);

            socket.on("answer", handleAnswer);

            socket.on("ice-candidate", handleNewICECandidateMsg);
        });

    }, []);



    function callUser(userID) {
        peerRef.current = createPeer(userID);
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        setPartner(true);
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
            setPartner(true);
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
        setAudio(audio => !audio);
        userStream.current.getAudioTracks()[0].enabled = !(userStream.current.getAudioTracks()[0].enabled);
    };
    const toggleVideo = () => {
        setVideo(video => !video);
        userStream.current.getVideoTracks()[0].enabled = !(userStream.current.getVideoTracks()[0].enabled);
    };

    // const toggleVideo = () => {
    //     if (video === true) {
    //         setVideo(false);
    //     } else {
    //         setVideo(true);
    //     }

    // };

    const hangUp = () => {
        if (!peerRef.current) {
            userStream.current.getTracks().forEach(track => track.stop());
            socket.emit("leave room", params.roomID);
            navigate("/");
            setPartner(false);
        }
        userStream.current.getTracks().forEach(track => track.stop());
        peerRef.current.close();
        socket.emit("leave room", params.roomID);
        navigate("/");
        setPartner(false);
    };





    return (
        <>
            <div className="webcam-section">
                <div className="userBorder userBorder-animationLeft" style={{ display: partner ? 'block' : 'none' }} >
                    <section className="partner-video">
                        <video autoPlay playsInline ref={partnerVideo} />
                    </section>
                </div>
                <div className="userBorder">
                    <section className="user-video">
                        <video autoPlay ref={userVideo} />
                    </section>
                </div>


            </div>
            <div className="webcam-controls">
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
import React from 'react'
import Room from '../routes/Room'
import SidebarComponent from '../components/SidebarComponent.jsx';
import YoutubeComponent from '../components/YoutubeComponent.jsx';
import { faComments, faHome, faUser, faTimes, faBars, faB } from "@fortawesome/free-solid-svg-icons";


const items = [
    { title: "Home", src: faHome },
    { title: "Chat", src: faComments },
    { title: "Profile", src: faUser },
];


export default function Index() {
    return (
        <>
            <Room />
            <SidebarComponent items={items} value={items} />
            <YoutubeComponent />
        </>
    )
}


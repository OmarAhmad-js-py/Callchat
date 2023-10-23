import * as React from 'react';
import { useState } from "react"
import ChatComponent from './ChatComponent.jsx';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import socket from '../routes/util/hooks/socketInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faHome, faUser, faBars, faSearch } from "@fortawesome/free-solid-svg-icons";


export default function SwipeableTemporaryDrawer() {
    const [videoID, setVideoID] = useState(null)
    const [text, setText] = useState("");
    const [state, setState] = useState({
        left: false,
    });
    const [chat, setChat] = useState(false);
    const items = [
        { title: "Home", src: faHome },
        { title: "Chat", src: faComments, onClick: () => setChat(!chat) },
        { title: "Profile", src: faUser },
    ]

    const handleSubmit = (e) => {
        e.preventDefault();
        let video_id = text.split('v=')[1];
        let ampersandPosition = video_id.indexOf('&');
        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        socket.emit('videoID', video_id)
        setVideoID(video_id)
    }






    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box className="bg-primary-800 h-screen"
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <div className="flex gap-x-1 items-center">
                    <img src="../src/assets/logo.png" className={`cursor-pointer duration-150 ${open && "rotate-[360deg]"}`} />
                    <h1 className={`text-white origin-left font-medium text-xl duration-150 ${!open && "scale-0"}`}>
                        Designer
                    </h1>
                </div>
                {items.map((item, index) => (
                    <ListItem key={index} onClick={item.onClick} disablePadding className="flex rounded-md p-2 cursor-pointer hover:bg-light-white text-white text-xl items-center gap-x-4 gap-y-4 mt-9 ">
                        <ListItemButton>
                            <ListItemIcon>
                                <FontAwesomeIcon icon={item.src} className="text-white" />
                            </ListItemIcon>
                            <span className={`${!open && "hidden"} origin-left duration-200`}>
                                {item.title}
                            </span>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

        </Box>
    );

    return (<>
        <div className="sidebar-container">
            {['left'].map((anchor) => (
                <React.Fragment key={anchor} >
                    <Button onClick={toggleDrawer(anchor, true)}><FontAwesomeIcon icon={faBars} size="lg" /></Button>
                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                    >
                        {list(anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
            {/* serach bar */}
            <div className="flex items-center justify-center ml-4 my-1 grow">
                <div className="flex items-center justify-center bg-light-white rounded-full w-96 h-12">
                    <form onSubmit={handleSubmit}>
                        <input type="text" onChange={e => setText(e.target.value)} value={text} className="indent-5 bg-transparent w-80 h-12 rounded-full outline-none" placeholder="Search" />
                        <button type="submit" className="bg-primary-800 w-16 h-12 rounded-full text-white">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>
                </div>
            </div>

        </div>
        <ChatComponent open={chat} />
    </>
    );
}
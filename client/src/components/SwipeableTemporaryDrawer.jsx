import * as React from 'react';
import { useState } from "react"
import YoutubeComponent from '../components/YoutubeComponent.jsx';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faHome, faUser, faBars } from "@fortawesome/free-solid-svg-icons";


export default function SwipeableTemporaryDrawer() {
    const [state, setState] = useState({
        left: false,
    });
    const [chat, setChat] = useState(false);
    const items = [
        { title: "Home", src: faHome },
        { title: "Chat", src: faComments, onClick: () => setChat(!chat) },
        { title: "Profile", src: faUser },
    ]

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
        <div className="sidebar-container" >
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

        </div>
        <YoutubeComponent open={chat} />
    </>
    );
}
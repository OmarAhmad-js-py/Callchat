import React from 'react'
import Room from '../routes/Room'
import SidebarComponent from '../components/SidebarComponent.jsx';
import SwipeableTemporaryDrawer from '../components/SwipeableTemporaryDrawer';


export default function Index() {
    return (
        <>
            <Room />
            {/* <SidebarComponent /> */}
            <SwipeableTemporaryDrawer />
        </>
    )
}


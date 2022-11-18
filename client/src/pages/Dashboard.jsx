import React from 'react'
import Login from '../routes/Createroom.jsx'
import { useLocalStorage } from '../routes/util/hooks/useLocalStorage';
import Index from './Index';
import { ConversationsProvider } from '../routes/util/Context/MessageProvider.jsx';




function Dashboard() {

    const dashboard = (

        <ConversationsProvider >
            <Index />
        </ConversationsProvider >
    )

    return (
        dashboard
    )
}

export default Dashboard;
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ProSidebarProvider } from 'react-pro-sidebar';
ReactDOM.createRoot(document.getElementById('root')).render(
  <ProSidebarProvider>
    <App />
  </ProSidebarProvider>
)

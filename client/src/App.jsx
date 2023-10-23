import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Dashboard from "./pages/Dashboard";
import "./routes/Createroom.css";
import './App.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateRoom />} />
        <Route path="/room/:roomID" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

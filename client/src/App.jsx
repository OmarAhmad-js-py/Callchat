import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import CreateRoom from "./routes/CreateRoom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
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

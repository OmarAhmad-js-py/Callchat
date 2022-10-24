import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import CreateRoom from "./routes/CreateRoom";
import Index from "./pages/Index";
import './App.css';


function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<CreateRoom />} />
        <Route path="/room/:roomID" element={<Index />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;

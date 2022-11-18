import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Dashboard from "./pages/Dashboard";
import './App.css';


function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<CreateRoom />} />
        <Route path="/room/:roomID" element={<Dashboard />} />
        {/* <Route path="/test" element={<SwipeableTemporaryDrawer />} /> */}

      </Routes>

    </BrowserRouter>
  );
}

export default App;

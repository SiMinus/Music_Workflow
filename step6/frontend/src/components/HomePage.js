import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";

function HomePage() {



    return (
        <Router>
            <Routes>
                <Route path="/" element={<p>This is the home page</p>} />
                <Route path="/join" element={<RoomJoinPage/>} />
                <Route path="/create" element={<CreateRoomPage/>} />

            </Routes>
        </Router>
    );

}

export default HomePage;
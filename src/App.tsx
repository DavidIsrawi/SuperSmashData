import React from 'react';
import './styles/App.css';
import { Sidebar } from './Sidebar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TournamentsInState } from './TournamentsInState';
import { Performance } from './Performance';
import { Player } from './Player';
import { NoPage } from './NoPage';
import { Home } from './Home';

function App() {

  return (
    <div className="app">
      <BrowserRouter>
        <Sidebar/>
        <div className="content-area">
          <Routes>
            <Route index element={<Home />} />
            <Route path="tournaments" element={<TournamentsInState />} />
            <Route path="player" element={<Player />} />
            <Route path="performance" element={<Performance />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

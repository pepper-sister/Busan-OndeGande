import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './pages/Home';
import DoingNow from './pages/DoingNow';
import MakingCourse from './pages/MakingCourse';
import GoThis from './pages/GoThis';
import YouTuber from './pages/YouTuber';
import MyCourse from './pages/MyCourse';
import RestaurantWindow from './RestaurantWindow';
import PlaceWindow from './PlaceWindow';
import SleepWindow from './SleepWindow';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doingnow" element={<DoingNow />} />
            <Route path="/makingcourse" element={<MakingCourse />} />
            <Route path="/gothis" element={<GoThis />} />
            <Route path="/youtuber" element={<YouTuber />} />
            <Route path="/mycourse" element={<MyCourse />} />
            <Route path="/restaurants" element={<RestaurantWindow />} />
            <Route path="/place" element={<PlaceWindow />} />
            <Route path="/sleep" element={<SleepWindow />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

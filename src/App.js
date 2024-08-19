import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Events from './pages/Events';
import Culture from './pages/Culture';
import TravelInfo from './pages/TravelInfo';
import MyCourse from './pages/MyCourse';
import RestaurantWindow from './RestaurantWindow';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/events" element={<Events />} />
            <Route path="/culture" element={<Culture />} />
            <Route path="/travel-info" element={<TravelInfo />} />
            <Route path="/my-course" element={<MyCourse />} />
            <Route path="/restaurants" element={<RestaurantWindow />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

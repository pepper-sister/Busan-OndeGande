import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import DoingNow from '../pages/DoingNow';
import MakingCourse from '../pages/MakingCourse';
import GoThis from '../pages/GoThis';
import YouTuber from '../pages/YouTuber';
import RestaurantWindow from '../pages/RestaurantWindow';
import PlaceWindow from '../pages/PlaceWindow';
import SleepWindow from '../pages/SleepWindow';

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doingnow" element={<DoingNow />} />
        <Route path="/makingcourse" element={<MakingCourse />} />
        <Route path="/gothis" element={<GoThis />} />
        <Route path="/youtuber" element={<YouTuber />} />
        <Route path="/restaurantwindow" element={<RestaurantWindow />} />
        <Route path="/placewindow" element={<PlaceWindow />} />
        <Route path="/sleepwindow" element={<SleepWindow />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
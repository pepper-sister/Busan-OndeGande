import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import YouTuMap from './YouTuMap';
import YouTuWindow from './YouTuWindow';
import './YouTuber.css';

function YouTuber() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  useEffect(() => {
    fetch('http://ec2-43-200-29-96.ap-northeast-2.compute.amazonaws.com:8080/api/travel-courses/youtubers')
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error('Error fetching course data:', error));
  }, []);

  const handleCourseClick = (courseId) => {
    fetch(`http://ec2-43-200-29-96.ap-northeast-2.compute.amazonaws.com:8080/api/travel-courses/${courseId}`)
      .then((response) => response.json())
      .then((courseDetails) => {
        setSelectedCourse(courseDetails);
        setIsWindowOpen(true);
      })
      .catch((error) => console.error('Error fetching course details:', error));
  };

  const closeWindow = () => {
    setIsWindowOpen(false);
    setSelectedCourse(null);
  };

  const groupPlacesByDay = (details) => {
    return details.reduce((acc, curr) => {
      const day = curr.day;
      if (!acc[day]) acc[day] = [];
      acc[day].push(curr.placeResponse);
      return acc;
    }, {});
  };

  return (
    <div>
      <section className="hero-section">
        <h1>부산 여행 코스 모음</h1>
        <p>유명 유튜버들이 추천하는 부산 여행 코스를 확인해보세요.</p>
      </section>

      <section className="feature-section">
        {courses.length === 0 ? (
          <p>Loading courses...</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="feature-card"
              onClick={() => handleCourseClick(course.id)}
            >
              <img
                src={course.youtubeImageUrl}
                alt={`${course.courseName} thumbnail`}
                className="video-thumbnail"
              />
              <h2>{course.creatorName}</h2>
              <h3>{course.courseName}</h3>
            </div>
          ))
        )}
      </section>

      {selectedCourse && (
        <YouTuWindow isOpen={isWindowOpen} onClose={closeWindow}>
          <ReactPlayer url={selectedCourse.youtubeUrl} width="100%" controls playing />
          {Object.entries(groupPlacesByDay(selectedCourse.travelCourseDetailResponse)).map(
            ([day, places], dayIndex) => (
              <div key={dayIndex} className="day-section">
                <h4>{`Day ${day}`}</h4>
                <ul>
                  {places.map((place, placeIndex) => (
                    <li key={placeIndex}>{place.placeName}</li>
                  ))}
                </ul>
                <YouTuMap places={places} />
              </div>
            )
          )}
        </YouTuWindow>
      )}
    </div>
  );
}


export default YouTuber;
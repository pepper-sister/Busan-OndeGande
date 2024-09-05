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
      .then((data) => {
        console.log("Fetched data:", data);
        const fetchedCourses = data.body.data.map((course) => ({
          id: course.id,
          youtuber: course.creatorName,
          title: course.courseName,
          link: course.youtubeUrl,
          days: course.day,
        }));
        setCourses(fetchedCourses);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);
  

  const handleCourseClick = (index) => {
    const selected = courses[index];
    fetch(`http://ec2-43-200-29-96.ap-northeast-2.compute.amazonaws.com:8080/api/travel-courses/${selected.id}`)
      .then((response) => response.json())
      .then((data) => {
        const courseDetail = data.body.data;
        const updatedCourse = {
          ...selected,
          link: courseDetail.youtubeUrl,
          days: courseDetail.travelCourseDetailResponse.reduce((acc, detail) => {
            const dayIndex = detail.day - 1;
            if (!acc[dayIndex]) {
              acc[dayIndex] = { day: `Day ${detail.day}`, places: [] };
            }
            acc[dayIndex].places.push({
              name: detail.placeResponse.placeName,
              latitude: detail.placeResponse.latitude,
              longitude: detail.placeResponse.longitude,
            });
            return acc;
          }, []),
        };
        setSelectedCourse(updatedCourse);
        setIsWindowOpen(true);
      })
      .catch((error) => {
        console.error('Error fetching course details:', error);
      });
  };

  const closeWindow = () => {
    setIsWindowOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div>
      <section className="hero-section">
        <h1>부산 여행 코스 모음</h1>
        <p>유명 유튜버들이 추천하는 부산 여행 코스를 확인해보세요.</p>
      </section>

      <section className="feature-section">
        {courses.map((course, index) => (
          <div
            key={index}
            className="feature-card"
            onClick={() => handleCourseClick(index)}
          >
            <img
              src={`https://img.youtube.com/vi/${course.link.split('v=')[1]}/0.jpg`}
              alt={`${course.title} thumbnail`}
              className="video-thumbnail"
            />
            <h2>{course.youtuber}</h2>
            <h3>{course.title}</h3>
          </div>
        ))}
      </section>

      {selectedCourse && (
        <YouTuWindow isOpen={isWindowOpen} onClose={closeWindow}>
          <ReactPlayer url={selectedCourse.link} width="100%" controls playing />
          {selectedCourse.days.map((day, dayIndex) => (
            <div key={dayIndex} className="day-section">
              <h4>{day.day}</h4>
              <ul>
                {day.places.map((place, placeIndex) => (
                  <li key={placeIndex}>{place.name}</li>
                ))}
              </ul>
              <YouTuMap places={day.places} />
            </div>
          ))}
        </YouTuWindow>
      )}
    </div>
  );
}

export default YouTuber;
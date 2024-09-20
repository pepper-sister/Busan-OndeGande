import React, { useState, useEffect, useRef  } from 'react';
import ReactPlayer from 'react-player';
import YouTuMap from './YouTuMap';
import YouTuWindow from './YouTuWindow';
import './YouTuber.css';

function YouTuber() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('DESC');
  //추가
  //const [randomCourse, setRandomCourse] = useState(null);
  const randomButtonRef = useRef(null);

  useEffect(() => {
    fetch('https://www.ondegande.site/api/travel-courses/youtubers')
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        const fetchedCourses = data.body.data.map((course) => ({
          id: course.id,
          youtuber: course.creatorName,
          title: course.courseName,
          link: course.youtubeUrl,
          days: course.days,
          reviews: course.viewCount,
        }));
        setCourses(fetchedCourses);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
    }, []);

    const handleSortChange = () => {
      const sortedCourses = [...courses].sort((a, b) => {
        if (sortOrder === 'ASC') {
          return a.reviews - b.reviews;
        } else {
          return b.reviews - a.reviews;
        }
      });
      setSortOrder((prevOrder) => (prevOrder === 'ASC' ? 'DESC' : 'ASC'));
      setCourses(sortedCourses);
    };



  const handleCourseClick = (index) => {
    const selected = courses[index];
    fetch(`https://www.ondegande.site/api/travel-courses/${selected.id}`)
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

  //랜덤 기능 추가
  // 랜덤 추천 버튼 클릭 시 호출되는 함수입니다.
  const handleRandomRecommend = () => {
    fetch('https://www.ondegande.site/api/travel-courses/youtubers/random')
      .then((response) => response.json())
      .then((data) => {
        const course = data.body.data;
        const updatedCourse = {
          id: course.id,
          youtuber: course.creatorName,
          title: course.courseName,
          link: course.youtubeUrl,
          days: course.travelCourseDetailResponse.reduce((acc, detail) => {
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
        console.error('Error fetching random course:', error);
      });
  };
  //여기까지

  const closeWindow = () => {
    setIsWindowOpen(false);
    setSelectedCourse(null);
    //setRandomCourse(null); //초기화에 랜덤 코스 추가

  };

  // Handle click outside to close the window
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (randomButtonRef.current && !randomButtonRef.current.contains(event.target)) {
        closeWindow();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);//ㅇㄱ;낒;

  return (
    <div>
      <section className="hero-section">
        <h1>부산 여행 코스 모음</h1>
        <p>유명 유튜버들이 추천하는 부산 여행 코스를 확인해보세요.</p>
        <button onClick={handleSortChange}>
          {sortOrder === 'ASC' ? '조회수 내림차순' : '조회수 오름차순'}
        </button>
        
        <button onClick={handleRandomRecommend}>
          랜덤 추천
        </button>


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
            <p>{course.reviews} reviews</p>
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

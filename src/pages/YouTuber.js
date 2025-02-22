import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import YouTuMap from './YouTuMap';
import '../styles/YouTuber.css';

const YouTuber = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sortOrder, setSortOrder] = useState('ASC');
  const randomButtonRef = useRef(null);

  const loadKakaoMap = () =>
    new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) return resolve();
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY}&libraries=services&autoload=false`;
      script.onload = () => (window.kakao?.maps ? resolve() : reject(new Error('Kakao Maps API 로드 실패')));
      script.onerror = () => reject(new Error('Kakao Maps API 스크립트 로드 오류'));
      document.head.appendChild(script);
    });

  const formatCourseDays = (details) =>
    details.reduce((acc, detail) => {
      const dayIndex = detail.day - 1;
      if (!acc[dayIndex]) acc[dayIndex] = { day: `Day ${detail.day}`, places: [] };
      acc[dayIndex].places.push({
        name: detail.placeResponse.placeName,
        latitude: detail.placeResponse.latitude,
        longitude: detail.placeResponse.longitude,
      });
      return acc;
    }, []);

  const fetchData = () => {
    fetch('https://www.ondegande.site/api/travel-courses/youtubers')
      .then((response) => response.json())
      .then((data) => {
        const fetchedCourses = data.body.data.travelCourses.map((course) => ({
          id: course.id,
          youtuber: course.creatorName,
          title: course.courseName,
          link: course.youtubeUrl,
          days: course.days,
          reviews: course.viewCount,
          thum: course.youtubeImageUrl,
        }));
        const sortedCourses = fetchedCourses.sort((a, b) => b.reviews - a.reviews);
        setCourses(sortedCourses);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  };

  useEffect(() => {
    loadKakaoMap()
      .then(() => window.kakao.maps.load(fetchData))
      .catch((error) => alert(error.message));
  }, []);

  const handleSortChange = () => {
    setCourses((prevCourses) =>
      [...prevCourses].sort((a, b) => (sortOrder === 'ASC' ? a.reviews - b.reviews : b.reviews - a.reviews))
    );
    setSortOrder((prevOrder) => (prevOrder === 'ASC' ? 'DESC' : 'ASC'));
  };

  const handleCourseClick = async (id) => {
    try {
      const response = await fetch(`https://www.ondegande.site/api/travel-courses/${id}`);
      const data = await response.json();
      const courseDetail = data.body.data;
      setSelectedCourse({
        id: courseDetail.id,
        youtuber: courseDetail.creatorName,
        title: courseDetail.courseName,
        link: courseDetail.youtubeUrl,
        days: formatCourseDays(courseDetail.travelCourseDetailResponse),
      });
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const handleRandomRecommend = async () => {
    try {
      const response = await fetch('https://www.ondegande.site/api/travel-courses/youtubers/random');
      const data = await response.json();
      const course = data.body.data;
      setSelectedCourse({
        id: course.id,
        youtuber: course.creatorName,
        title: course.courseName,
        link: course.youtubeUrl,
        days: formatCourseDays(course.travelCourseDetailResponse),
      });
    } catch (error) {
      console.error('Error fetching random course:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (randomButtonRef.current && !randomButtonRef.current.contains(event.target)) {
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <main>
        <section className="YouTu-section">
          <section className="YouTuCourse-section">
            <div className="button-container2">
              <button onClick={handleSortChange}>
                {sortOrder === 'ASC' ? '조회수 ▲' : '조회수 ▼'}
              </button>
              <button onClick={handleRandomRecommend}>랜덤 코스</button>
            </div>

            <section className="YTC-section">
              <div className="feature-card-container">
                {courses.map((course, index) => (
                  <div
                    key={index}
                    className="feature-card"
                    onClick={() => handleCourseClick(index)}
                  >
                    <img
                      src={`${course.thum}`}
                      alt={`${course.title} thumbnail`}
                      className="video-thumbnail"
                    />
                    <h2>{course.youtuber}</h2>
                    <h3>{course.title}</h3>
                    <p>{course.reviews} reviews</p>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <section className="CourseCheck-section">
            {selectedCourse ? (
              <>
                <ReactPlayer url={selectedCourse.link} width="100%" controls playing />
                <h2 className="course-title">{selectedCourse.title}</h2>
                <h3 className="youtuber-name">{selectedCourse.youtuber}</h3>
                {selectedCourse.days.map((day, dayIndex) => (
                  <div key={dayIndex} className="day-section">
                    <h4>{day.day}</h4>
                    <ul>
                      {day.places.map((place, placeIndex) => (
                        <li key={placeIndex}>
                          {placeIndex + 1}. {place.name}
                        </li>
                      ))}
                    </ul>
                    <YouTuMap places={day.places} mapId={`map-${dayIndex}`} />
                  </div>
                ))}
              </>
            ) : (
              <p>코스를 확인해보세요.</p>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default YouTuber;

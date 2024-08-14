import React, { useState } from 'react';
import './Events.css';

function Events() {
  const [courses, setCourses] = useState([]);

  const addCourse = () => {
    setCourses([...courses, 'New Course']);
  };

  const deleteCourse = (indexToRemove) => {
    setCourses(courses.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="events-container">
      <div className="sidebar-left">
        <h2>장소 추가</h2>
        <input type="text" className="search-input" placeholder="장소 검색" />
        <button className="add-button" onClick={addCourse}>+</button>
      </div>

      <div className="map-container">
      </div>

      <div className="sidebar-right">
        <h2>현재 코스</h2>
        <ul>
          {courses.map((course, index) => (
            <li key={index}>
              {course}
              <button className="delete-button" onClick={() => deleteCourse(index)}>삭제</button>
              </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Events;

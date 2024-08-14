import React from 'react';
import './MyCourse.css';
import CourseImage from '../img2.jpg';

function MyCourse() {
  const courses = [
    { img: CourseImage, name: '코스 1', details: ['어디', '저기', '여기', '온데', '간데'] },
    { img: CourseImage, name: '코스 2', details: ['어디', '저기', '여기', '온데', '간데'] },
    { img: CourseImage, name: '코스 3', details: ['어디', '저기', '여기', '온데', '간데'] },
  ];

  return (
    <div className="my-course-container">
      <h1>나의 코스</h1>
      
      <section className="course-section">
        {courses.map((course, index) => (
          <div key={index} className="course-card">
            <img src={course.img} alt={course.name} className="course-image" />
            <h2 className="course-name">{course.name}</h2>
            <ul className="course-details">
              {course.details.map((detail, idx) => (
                <li key={idx}>{idx + 1}. {detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

export default MyCourse;

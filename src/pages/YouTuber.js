import React from 'react';
import './YouTuber.css';
import CourseImage from '../img.jpg';

function TravelInfo() {
  const features = [
    { img: CourseImage, name: '코스 1', likes: 23 },
    { img: CourseImage, name: '코스 2', likes: 45 },
    { img: CourseImage, name: '코스 3', likes: 12 },
    { img: CourseImage, name: '코스 4', likes: 67 },
    { img: CourseImage, name: '코스 5', likes: 34 },
    { img: CourseImage, name: '코스 6', likes: 89 },
    { img: CourseImage, name: '코스 7', likes: 21 },
    { img: CourseImage, name: '코스 8', likes: 54 },
    { img: CourseImage, name: '코스 9', likes: 77 },
    { img: CourseImage, name: '코스 10', likes: 16 },
    { img: CourseImage, name: '코스 11', likes: 39 },
    { img: CourseImage, name: '코스 12', likes: 60 },
  ];

  return (
    <div>
      <section className="hero-section">
        <h1>명예의 코스</h1>
        <p>현재 인기 많은 코스를 확인해보세요.</p>
      </section>
      
      <section className="feature-section">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <img src={feature.img} alt={feature.name} className="feature-image" />
            <div className="feature-info">
              <h3 className="feature-name">{feature.name}</h3>
              <p className="feature-likes">
                <span className="heart-icon">❤️</span> {feature.likes}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default TravelInfo;

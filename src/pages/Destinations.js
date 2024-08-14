import React, { useState } from 'react';
import './Destinations.css';

function Destinations() {
  const [distance, setDistance] = useState(500); // Default distance in meters
  const [category, setCategory] = useState('food'); // Default category

  const handleDistanceChange = (event) => {
    setDistance(event.target.value);
  };

  const handleCategoryClick = (category) => {
    setCategory(category);
  };

  return (
    <div className="destinations-container">
      <h1>이제 뭐하지?</h1>
      <p>주변 놀거리를 불러오기 위한 위치를 설정해주세요.</p>
      
      <div className="search-container">
        <input 
          type="text" 
          placeholder="위치를 입력하세요" 
          className="search-input"
        />
      </div>

      <div className="range-slider-container">
        <label htmlFor="distance">반경: {distance}m</label>
        <input 
          id="distance" 
          type="range" 
          min="100" 
          max="1000" 
          step="100" 
          value={distance} 
          onChange={handleDistanceChange}
          className="range-slider"
        />
      </div>

      <div className="category-buttons">
        <button 
          className={`category-button ${category === 'food' ? 'active' : ''}`} 
          onClick={() => handleCategoryClick('food')}
        >
          맛집
        </button>
        <button 
          className={`category-button ${category === 'sightseeing' ? 'active' : ''}`} 
          onClick={() => handleCategoryClick('sightseeing')}
        >
          관광지
        </button>
        <button 
          className={`category-button ${category === 'accommodation' ? 'active' : ''}`} 
          onClick={() => handleCategoryClick('accommodation')}
        >
          숙소
        </button>
      </div>
    </div>
  );
}

export default Destinations;
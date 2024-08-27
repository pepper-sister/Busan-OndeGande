import React, { useState } from 'react';
import './GoThis.css';
import regionImage from '../img.jpg';

function Culture() {
  const regions = [
    '전체', '강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', 
    '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구'
  ];
  
  const themes = [
    '전체', '역사', '자연', '문화', '음식', '쇼핑', '야경'
  ];
  
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);

  const handleRegionToggle = (region) => {
    if (region === '전체') {
      setSelectedRegions(selectedRegions.length === regions.length - 1 ? [] : regions.slice(1));
    } else {
      setSelectedRegions(prev =>
        prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
      );
    }
  };

  const handleThemeToggle = (theme) => {
    if (theme === '전체') {
      setSelectedThemes(selectedThemes.length === themes.length - 1 ? [] : themes.slice(1));
    } else {
      setSelectedThemes(prev =>
        prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
      );
    }
  };

  return (
    <div className="culture-container">
      <h1>맞춤형 코스</h1>
      
      <div className="selection-container">
        <div className="selection-section">
        <img src={regionImage} alt="지역 이미지" className="section-image" />
          <h2>지역 선택</h2>
          <div className="button-group">
            {regions.map(region => (
              <button
                key={region}
                className={`selection-button ${selectedRegions.includes(region) ? 'selected' : ''}`}
                onClick={() => handleRegionToggle(region)}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
        
        <div className="selection-section">
          <h2>테마 선택</h2>
          <div className="button-group">
            {themes.map(theme => (
              <button
                key={theme}
                className={`selection-button ${selectedThemes.includes(theme) ? 'selected' : ''}`}
                onClick={() => handleThemeToggle(theme)}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <button className="submit-button">코스 확인하기</button>
    </div>
  );
}

export default Culture;

import React, { useState } from 'react';
import './GoThis.css';

// Busan 이미지 URL을 직접 사용합니다.
const regionImage = 'https://www.busan.go.kr/resource/img/busan/sub/sub0284_img01.jpg';

function GoThis() {
  const regions = [
    '전체', '강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', 
    '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구','해운대구'
  ];

  const themes = [
    '전체',         
    '레저',
    '맛',
    '무장애',
    '문화',
    '반려동물',
    '역사',
    '연예인',
    '힐링'
  ];

  const themeToSEQ = {
    '레저': ['282','431','468','490','861','980'],
    '맛': ['464','1145','1182','1326','1369','1400','1407','1774','1873'],
    '무장애': ['310','469'],
    '문화': ['350','1195','353','374','378','381','382','394','1175','1189','1194'],
    '반려동물': ['466','845','1201','1678'],
    '역사': ['303','309','408','417','513','787','856'],
    '연예인': ['305','454','476','477','770','789','854','1190','1199','1358','1373','1414','1417','1682'],
    '힐링': ['306','1876','1745','307','323','352','356','357','398','424','1190','1199','1358','1373','1414','1417','1682']
  };

  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [popupImage, setPopupImage] = useState(null);

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

  const fetchResults = async () => {
    if (selectedThemes.length === 0) {
      alert('테마를 선택하세요.');
      return;
    }
    if (selectedRegions.length === 0) {
      alert('지역을 선택하세요.');
      return;
    }

    const urls = [
      'https://apis.data.go.kr/6260000/RecommendedService/getRecommendedKr?serviceKey=LpRShO6N0YOaDWlm39RI18TKXcngzr%2BlgRVyhCOqeXLa%2F6CvYPw29m7qRq3G7M4MAUyU%2Bcp54V%2BiSK6dg%2BRbYA%3D%3D&pageNo=1&numOfRows=106',
      'https://apis.data.go.kr/6260000/RecommendedService/getRecommendedKr?serviceKey=LpRShO6N0YOaDWlm39RI18TKXcngzr%2BlgRVyhCOqeXLa%2F6CvYPw29m7qRq3G7M4MAUyU%2Bcp54V%2BiSK6dg%2BRbYA%3D%3D&pageNo=2&numOfRows=106'
    ];

    const fetchData = async (url) => {
      const response = await fetch(url);
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
      return Array.from(xmlDoc.getElementsByTagName("item"));
    };

    const page1Items = await fetchData(urls[0]);
    const page2Items = await fetchData(urls[1]);

    const allItems = [...page1Items, ...page2Items];

    const resultsArray = allItems.map(item => {
      const ucSeq = item.getElementsByTagName("UC_SEQ")[0]?.textContent || '';
      const mainTitle = item.getElementsByTagName("MAIN_TITLE")[0]?.textContent || '';
      const gugunNm = item.getElementsByTagName("GUGUN_NM")[0]?.textContent || '';
      const trfcInfo = item.getElementsByTagName("TRFC_INFO")[0]?.textContent || '';
      const hldyInfo = item.getElementsByTagName("HLDY_INFO")[0]?.textContent || '';
      const mainImgNormal = item.getElementsByTagName("MAIN_IMG_NORMAL")[0]?.textContent || '';
      const itemCntnts = item.getElementsByTagName("ITEMCNTNTS")[0]?.textContent || '';

      return { ucSeq, mainTitle, gugunNm, trfcInfo, hldyInfo, mainImgNormal, itemCntnts };
    });

    const filteredResults = resultsArray.filter(result =>
      selectedThemes.some(theme => themeToSEQ[theme].includes(result.ucSeq)) &&
      selectedRegions.includes(result.gugunNm)
    );

    setResults(filteredResults);
    setError(filteredResults.length === 0 ? '선택한 조건에 맞는 결과가 없습니다.' : null);
  };

  const handleSubmit = () => {
    setError(null);
    fetchResults();
  };

  const handleImagePopup = (imgUrl, textContent) => {
    setPopupImage({ imgUrl, textContent });
  };

  const handleClosePopup = () => {
    setPopupImage(null);
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
      
      <button className="submit-button" onClick={handleSubmit}>코스 확인하기</button>
      
      <div className="results-container">
        {error && <p className="error-message">{error}</p>}
        {results.length === 0 && !error && <p className="no-results-message">결과가 없습니다.</p>}
        {results.length > 0 && (
          results.map((result, index) => (
            <div key={index} className="result-item">
              <h3 className="result-title">{result.mainTitle}</h3>
              {result.trfcInfo && result.trfcInfo !== '정보 없음' && <p>교통 정보: {result.trfcInfo}</p>}
              {result.hldyInfo && result.hldyInfo !== '정보 없음' && <p>휴일 정보: {result.hldyInfo}</p>}
              {result.gugunNm && <p>구군: {result.gugunNm}</p>}
              {result.mainImgNormal && (
                <button 
                  className="image-button" 
                  onClick={() => handleImagePopup(result.mainImgNormal, result.itemCntnts)}
                >
                  보기
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {popupImage && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            {popupImage.imgUrl && (
              <div className="popup-image-container">
                <img src={popupImage.imgUrl} alt="상세 이미지" className="popup-image" />
              </div>
            )}
            {popupImage.textContent && (
              <div className="popup-text">
                <div dangerouslySetInnerHTML={{ __html: popupImage.textContent }} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GoThis;

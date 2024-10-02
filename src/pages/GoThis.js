import React, { useState } from 'react';
import './GoThis.css';

function GoThis() {
  const regions = [
    '전체', '강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', 
    '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구','해운대구'
  ];

  const themes = [
    '전체',         
    '레저',
    '맛',
    '휠체어',
    '문화',
    '반려동물',
    '역사',
    '연예인',
    '힐링'
  ];

  const themeToSEQ = {
    '레저': ['282','431','468','490','861','980'],
    '맛': ['464','1145','1182','1326','1369','1400','1407','1774','1873'],
    '휠체어': ['310','469'],
    '문화': [
    '350', '353', '374', '378', '381', '382', '394', '485', '491', '514', 
    '780', '847', '853', '858', '1015', '1140', '1154', '1174', '1178', 
    '1183', '1189', '1194', '1195', '1198', '1318', '1319', '1325', '1334', 
    '1406', '1408', '1413', '1656', '1745', '1876'
    ],
    '반려동물': ['466','845','1201','1678'],
    '역사': ['303', '309', '408', '417', '513', '787', '856'],
    '연예인': [
    '305', '454', '476', '477', '770', '789', '854', '860', '1190', '1199', 
    '1358', '1373', '1414', '1417', '1682'
    ],
    '힐링': [
    '58', '254', '283', '284', '306', '307', '323', '352', '356', '357', '398', 
    '423', '424', '451', '452', '453', '465', '471', '472', '475', '484', '487', 
    '488', '489', '507', '512', '515', '521', '761', '775', '776', '786', '791', 
    '795', '798', '808', '809', '812', '831', '843', '846', '855', '857', '977', 
    '981', '983', '998', '999', '1000', '1001', '1002', '1003', '1004', '1017', 
    '1019', '1022', '1027', '1064', '1079', '1139', '1141', '1143', '1144', '1146', 
    '1147', '1149', '1150', '1151', '1152', '1153', '1155', '1158', '1169', '1170', 
    '1171', '1176', '1180', '1181', '1184', '1186', '1188', '1192', '1193', '1196', 
    '1197', '1200', '1205', '1207', '1208', '1209', '1212', '1214', '1215', '1218', 
    '1302', '1303', '1304', '1306', '1307', '1308', '1317', '1320', '1321', '1324', 
    '1356', '1363', '1365', '1367', '1372', '1386', '1399', '1401', '1415', '1420', 
    '1675', '1727', '1771', '1789', '1823'
    ]
  };

  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [popupImage, setPopupImage] = useState(null);
  const [randomCourse, setRandomCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const SERVICE_KEY = process.env.REACT_APP_SERVICE_KEY;

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
    if (selectedRegions.length === 0) {
      alert('지역을 선택해주세요.');
      return;
    }

    if (selectedThemes.length === 0) {
      alert('테마를 선택해주세요.');
      return;
    }

    setLoading(true);

    const urls = [
      `https://apis.data.go.kr/6260000/RecommendedService/getRecommendedKr?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=106`,
      `https://apis.data.go.kr/6260000/RecommendedService/getRecommendedKr?serviceKey=${SERVICE_KEY}&pageNo=2&numOfRows=106`
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
      const subTitle = item.getElementsByTagName("TITLE")[0]?.textContent || '';
  
      return { ucSeq, mainTitle, gugunNm, trfcInfo, hldyInfo, mainImgNormal, itemCntnts, subTitle };
    });

    const filteredResults = resultsArray.filter(result =>
      selectedThemes.some(theme => themeToSEQ[theme].includes(result.ucSeq)) &&
      selectedRegions.includes(result.gugunNm)
    );

    setResults(filteredResults);
    setRandomCourse(null);
    setError(filteredResults.length === 0 ? '선택한 조건에 맞는 결과가 없습니다.' : null);
    setLoading(false);
  };

  const handleSubmit = () => {
    setError(null);
    fetchResults();
  };

  const handleRandomCourse = () => {
    if (selectedRegions.length === 0) {
      alert('지역을 선택해주세요.');
      return;
    }
  
    if (selectedThemes.length === 0) {
      alert('테마를 선택해주세요.');
      return;
    }

    if (results.length > 0) {
      const randomIndex = Math.floor(Math.random() * results.length);
      setRandomCourse(results[randomIndex]);
    } else {
      alert('먼저 모든 코스를 확인해주세요.');
    }
  };

  const handleImagePopup = (imgUrl, textContent, mainTitle, subTitle) => {
    setPopupImage({ imgUrl, textContent, mainTitle, subTitle });
  };

  const handleClosePopup = () => {
    setPopupImage(null);
  };

  const cleanTitle = (title) => {
    return title.replace(/\(.*?\)/, '').trim();
  };

  return (
    <div>
      <main>
        <section className="GTup-section">
          <section className="busanmap-section">
          </section>

          <section className="maptheme-section">
            <section className="mapselect-section">
              <h2>지역</h2>
              <div className="GTbutton-group">
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
            </section>

            <section className="themeselect-section">
              <h2>테마</h2>
              <div className="GTbutton-group">
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
            </section>

            <div className="submit-button-container">
              <button className="submit-button" onClick={handleSubmit}>코스 보기</button>
              <button className="submit-button" onClick={handleRandomCourse}>랜덤 코스</button>
            </div>
          </section>
        </section>

        <section className="mapthemecourse-section">
        <div className="results-container">
        {error && <p className="error-message">{error}</p>}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        )}
        {!loading && results.length === 0 && !error && <p className="no-results-message">원하는 지역 및 테마를 선택하세요.</p>}
        {!loading && (results.length > 0 || randomCourse) && (
          (randomCourse ? [randomCourse] : results).map((result, index) => (
            <div key={index} className="result-item">
              <div className="result-content">
                <div className="result-image">
                  {result.mainImgNormal && (
                    <img 
                      src={result.mainImgNormal} 
                      alt={result.mainTitle} 
                      className="course-image" 
                    />
                  )}
                </div>
                <div className="result-details">
                  <h3 className="result-title">{cleanTitle(result.mainTitle)}</h3>
                  {result.subTitle !== '정보 없음' && (
                    <>
                      <p className="result-hldy-info">{result.subTitle}</p>
                    </>
                  )}
                  <button 
                    className="course-button" 
                    onClick={() => handleImagePopup(result.mainImgNormal, result.itemCntnts, result.mainTitle, result.subTitle)}
                  >
                    자세히
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {popupImage && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
          <button className="popup-close-button" onClick={handleClosePopup}>&times;</button>
            {popupImage.imgUrl && (
              <div className="popup-image-container">
                <img src={popupImage.imgUrl} alt="상세 이미지" className="popup-image" />
              </div>
            )}
            {popupImage.textContent && (
              <div className="popup-title">
                <h2 className="popup-main-title">{cleanTitle(popupImage.mainTitle)}</h2>
                <h4 className="popup-sub-title">{popupImage.subTitle}</h4>
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
        </section>
      </main>
    </div>
  );
}

export default GoThis;
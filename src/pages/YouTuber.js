import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import YouTuMap from './YouTuMap';
import './YouTuber.css';

function YouTuber() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const courses = [
    {
      youtuber: '숲슬기Soopseulgi',
      title: '부산 여행 꽉〰찬 1박 2일 스케쥴 공유',
      link: 'https://www.youtube.com/watch?v=LTFAaPdvzTk',
      days: [
        {
          day: 'Day 1',
          places: [
            { name: '부산역', latitude: 35.114495, longitude: 129.03933 },
            { name: '이가네떡볶이', latitude: 35.0974206, longitude: 129.0303631 },
            { name: '이재모피자', latitude: 35.0988553, longitude: 129.0336809 },
            { name: '국제시장', latitude: 35.1015366, longitude: 129.0282482 },
            { name: '깡통시장', latitude: 35.1018526, longitude: 129.0259122 },
            { name: '보수동 책방골목', latitude: 35.1031252, longitude: 129.0274609 },
            { name: '영도해녀촌', latitude: 35.0672442, longitude: 129.0660829 },
            { name: '흰여울문화마을', latitude: 35.0782798, longitude: 129.0453198 },
            { name: '라발스호텔', latitude: 35.094683, longitude: 129.0391374 },
            { name: '미포 스카이캡슐', latitude: 35.158284, longitude: 129.1727672 },
            { name: '해운대', latitude: 35.1586975, longitude: 129.1603842 },
            { name: '호랑이떡젤리', latitude: 35.158585, longitude: 129.1708917 },
            { name: '영도 포차거리', latitude: 35.093466, longitude: 129.0384347 }
          ]
        },
        {
          day: 'Day 2',
          places: [
            { name: '모모스커피', latitude: 35.2193108, longitude: 129.0864105 },
            { name: '민락수변공원', latitude: 35.1545716, longitude: 129.1329907 },
            { name: '수변최고돼지국밥', latitude: 35.1567627, longitude: 129.134279 },
            { name: '광안리해수욕장', latitude: 35.1531696, longitude: 129.118666 },
            { name: '코지모지', latitude: 35.1567889, longitude: 129.1192723 },
            { name: '부산역', latitude: 35.114495, longitude: 129.03933 }
          ]
        }
      ]
    },
    {
      youtuber: '여행전문 스팟 라이트',
      title: '지금 우리 부산갈래? 부산여행 1박2일 코스 안내',
      link: 'https://www.youtube.com/watch?v=yT7y8xyNHHs',
      days: [
        {
          day: 'Day 1',
          places: [
            { name: '감천문화마을', latitude: 35.0973904, longitude: 129.0105924 },
            { name: '영도대교', latitude: 35.0956044, longitude: 129.0364923 },
            { name: '깡깡이마을', latitude: 35.0918144, longitude: 129.0338503 },
            { name: '태종대', latitude: 35.05307, longitude: 129.0872 },
            { name: 'BIFF광장', latitude: 35.0984918, longitude: 129.0276678 },
            { name: '보수동책방골목', latitude: 35.1031252, longitude: 129.0274609 },
            { name: '부평깡통시장', latitude: 35.1018526, longitude: 129.0259122 }
          ]
        },
        {
          day: 'Day 2',
          places: [
            { name: '해동용궁사', latitude: 35.1883491, longitude: 129.2233197 },
            { name: '해운대 해수욕장', latitude: 35.1586975, longitude: 129.1603842 },
            { name: '블루라인파크', latitude: 35.1613733, longitude: 129.1918758 },
            { name: '부산 엑스더스카이', latitude: 35.159848, longitude: 129.1697909 },
            { name: '광안리 해수욕장', latitude: 35.1531696, longitude: 129.118666 }
          ]
        }
      ]
    },
    {
      youtuber: '티플 TIPLE',
      title: '부산만 30번 가본 J가 알려주는 동선 낭비없는 1박2일 부산 여행',
      link: 'https://www.youtube.com/watch?v=nCVpf0cqgxU',
      days: [
        {
          day: 'Day 1',
          places: [
            { name: '부산역', latitude: 35.114495, longitude: 129.03933 },
            { name: '차이나타운 \'신발원\'', latitude: 35.1148152, longitude: 129.038688 },
            { name: '송도 케이블카', latitude: 35.0763876, longitude: 129.0236199 },
            { name: '송도 용궁구름다리', latitude: 35.061897, longitude: 129.022214 },
            { name: '책방골목 \'보수동가\'', latitude: 35.1031252, longitude: 129.0274609 },
            { name: '깡통시장', latitude: 35.1018526, longitude: 129.0259122 },
            { name: '영화 체험박물관', latitude: 35.101702, longitude: 129.0337655 },
            { name: '토요코인 호텔 부산중앙역', latitude: 35.10548, longitude: 129.036042 }
          ]
        },
        {
          day: 'Day 2',
          places: [
            { name: '태종대', latitude: 35.05307, longitude: 129.0872 },
            { name: '흰여울문화마을 \'씨씨윗북\'', latitude: 35.0782798, longitude: 129.0453198 }
          ]
        }
      ]
    },
    {
      youtuber: '유리소리TV',
      title: '[부산여행] 동선낭비없는 부산 2박3일 코스',
      link: 'https://www.youtube.com/watch?v=SfVrCxGJ0Ic',
      days: [
        {
          day: 'Day 1 (해운대 중심)',
          places: [
            { name: '블루라인파크 해변열차', latitude: 35.1613733, longitude: 129.1918758 },
            { name: '부산 엑스더스카이', latitude: 35.159848, longitude: 129.1697909 },
            { name: '해운대해수욕장', latitude: 35.1586975, longitude: 129.1603842 },
            { name: '더베이101', latitude: 35.1565954, longitude: 129.1520357 },
          ],
        },
        {
          day: 'Day 2 (부산 원도심 중심)',
          places: [
            { name: '감천문화마을', latitude: 35.0973904, longitude: 129.0105924 },
            { name: '송도케이블카', latitude: 35.0763876, longitude: 129.0236199 },
            { name: '용궁구름다리', latitude: 35.061897, longitude: 129.022214 },
            { name: '흰여울문화마을', latitude: 35.0782798, longitude: 129.0453198 },
            { name: '오륙도스카이워크', latitude: 35.1006767, longitude: 129.1244009 },
            { name: '광안리해수욕장', latitude: 35.1531696, longitude: 129.118666 },
          ],
        },
        {
          day: 'Day 3 (기장 중심)',
          places: [
            { name: '해동용궁사', latitude: 35.1883491, longitude: 129.2233197 },
            { name: '아홉산숲', latitude: 35.2871145, longitude: 129.1715058 },
          ],
        },
      ],
    },
    {
      youtuber: '오수끼',
      title: '부산 당일치기 여행코스 추천🌊',
      link: 'https://www.youtube.com/watch?v=vzOzmGVz42w',
      days: [
        {
          day: 'Day 1',
          places: [
            { name: '낙불집 (점심 식사)', latitude: 35.1754372, longitude: 129.1965124 },
            { name: '죽도공원 (산책)', latitude: 35.1801545, longitude: 129.2051442 },
            { name: '송정동 핫도그', latitude: 35.1809244, longitude: 129.2040193 },
            { name: '송정역 해변열차 탑승', latitude: 35.1858934, longitude: 129.2044819 },
            { name: '다릿돌전망대', latitude: 35.1640365, longitude: 129.1967173 },
            { name: '카페 (청사포역)', latitude: 35.1607788, longitude: 129.1912301 },
            { name: '청사포역 해변열차 탑승', latitude: 35.1607788, longitude: 129.1912301 },
            { name: '미포역 해변열차 내림', latitude: 35.158284, longitude: 129.1727672 },
            { name: '호랑이 젤라떡', latitude: 35.158585, longitude: 129.1708917 },
            { name: '해운대', latitude: 35.1630667, longitude: 129.1635961 },
            { name: '무스비', latitude: 35.1634773, longitude: 129.1561791 },
          ],
        },
      ],
    },
  ];

  const handleCourseClick = (index) => {
    if (selectedCourse === index) {
      setSelectedCourse(null);
    } else {
      setSelectedCourse(index);
    }
  };

  const handleThumbnailClick = (index) => {
    if (playingVideo === index) {
      setPlayingVideo(null);
    } else {
      setPlayingVideo(index);
      setSelectedCourse(index);
    }
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
            {playingVideo === index ? (
              <ReactPlayer url={course.link} width="100%" controls playing />
            ) : (
              <img
                src={`https://img.youtube.com/vi/${course.link.split('v=')[1]}/0.jpg`}
                alt={`${course.title} thumbnail`}
                className="video-thumbnail"
                onClick={(e) => {
                  e.stopPropagation();
                  handleThumbnailClick(index);
                }}
              />
            )}
            <h2>{course.youtuber}</h2>
            <h3>{course.title}</h3>

            {selectedCourse === index && (
              <div className="course-details">
                {course.days.map((day, dayIndex) => (
                  <div key={dayIndex} className="day-section">
                    <h4>{day.day}</h4>
                    <ul>
                      {day.places.map((place, placeIndex) => (
                        <li key={placeIndex}>
                          {place.name} (위도: {place.latitude}, 경도: {place.longitude})
                        </li>
                      ))}
                    </ul>
                    <div
                      onClick={(e) => e.stopPropagation()}
                    >
                      <YouTuMap places={day.places} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default YouTuber;
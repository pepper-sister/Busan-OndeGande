import React, { useEffect, useRef } from 'react';

const YouTuMap = ({ places }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.kakao || !mapContainer.current) return;

    const { kakao } = window;

    if (mapInstance.current) {
      mapInstance.current.setMap(null);
    }

    const map = new kakao.maps.Map(mapContainer.current, {
      center: new kakao.maps.LatLng(places[0]?.latitude || 37.5665, places[0]?.longitude || 126.978),
      level: 7,
    });

    mapInstance.current = map;

    const markers = [];
    const path = [];

    places.forEach((place, index) => {
      const markerImage = createMarkerImage(index + 1);
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(place.latitude, place.longitude),
        image: markerImage,
      });

      marker.setMap(map);
      markers.push(marker);
      path.push(new kakao.maps.LatLng(place.latitude, place.longitude));
    });

    if (path.length > 1) {
      const polyline = new kakao.maps.Polyline({
        path: path,
        strokeWeight: 4,
        strokeColor: '#FF6F61',
        strokeOpacity: 0.7,
        strokeStyle: 'solid',
      });
      polyline.setMap(map);
    }

    const bounds = new kakao.maps.LatLngBounds();
    places.forEach(place => {
      bounds.extend(new kakao.maps.LatLng(place.latitude, place.longitude));
    });
    map.setBounds(bounds);

    return () => {
      markers.forEach(marker => marker.setMap(null));
      mapInstance.current = null;
    };
  }, [places]);

  const createMarkerImage = (number) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const size = 50;
    const radius = size / 2.8;
    canvas.width = size;
    canvas.height = size;

    context.beginPath();
    context.arc(radius, radius, radius - 5, 0, 2 * Math.PI);
    context.fillStyle = '#FF6F61';
    context.fill();
    context.strokeStyle = '#FFFFFF';
    context.lineWidth = 3;
    context.stroke();
    context.closePath();

    context.font = 'bold 16px Arial';
    context.fillStyle = '#FFFFFF';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number, radius, radius);

    const image = new window.kakao.maps.MarkerImage(canvas.toDataURL(), new window.kakao.maps.Size(size, size));
    return image;
  };

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '500px' }}></div>
  );
};

export default YouTuMap;
import React, { useEffect } from 'react';

const { kakao } = window;

function YouTuMap({ places, mapId }) {
  useEffect(() => {
    const mapContainer = document.getElementById(mapId);
    const mapOption = {
      center: new kakao.maps.LatLng(places[0].latitude, places[0].longitude),
      level: 5,
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);

    const bounds = new kakao.maps.LatLngBounds();
    const linePath = [];

    const infowindow = new kakao.maps.InfoWindow({
      zIndex: 1,
    });

    places.forEach((place, index) => {
      const markerPosition = new kakao.maps.LatLng(place.latitude, place.longitude);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        map: map,
        title: `${index + 1}. ${place.name}`,
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.setContent(`<div style="padding:5px;">${place.name}</div>`);
        infowindow.open(map, marker);
      });

      linePath.push(markerPosition);
      bounds.extend(markerPosition);
    });

    const polyline = new kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: '#4373D0',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });

    polyline.setMap(map);

    map.setBounds(bounds);
  }, [places, mapId]);

  return <div id={mapId} style={{ width: '100%', height: '30vh' }}></div>;
}

export default YouTuMap;

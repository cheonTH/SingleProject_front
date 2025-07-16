import React, { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import "./Kakao.css";
import PlaceDetailModal from "./PlaceDetailModel";

const KakaoCategorySearch = ({ keyword, isAdmin }) => {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // ✅ 거리 계산 함수 (Haversine)
  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // meters
    const toRad = (x) => (x * Math.PI) / 180;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lng2 - lng1);

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // meters
  };

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setCurrentPosition({ lat: 37.5665, lng: 126.978 }); // fallback to 서울
      }
    );
  }, []);

  useEffect(() => {
    if (!map || !currentPosition || !window.kakao?.maps?.services) return;

    const ps = new window.kakao.maps.services.Places(map);
    ps.keywordSearch(
      keyword,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const filtered = data
            .map((place) => {
              const distance = getDistance(
                currentPosition.lat,
                currentPosition.lng,
                Number(place.y),
                Number(place.x)
              );
              return { ...place, distance };
            })
            .filter((p) => p.distance <= 550) // ✅ 250m 이내
            .sort((a, b) => a.distance - b.distance) // 거리순 정렬
            .slice(0, 5); // 최대 5개만

          setPlaces(filtered);
        } else {
          setPlaces([]);
        }
      },
      {
        location: new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng),
        radius: 1000,
        sort: "accuracy",
      }
    );
  }, [map, keyword, currentPosition]);

  useEffect(() => {
  if (!map || !currentPosition || places.length === 0 || !window.kakao?.maps?.LatLngBounds) return;

  const bounds = new window.kakao.maps.LatLngBounds();

  // 현재 위치 포함
  bounds.extend(new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng));

  // 장소 마커들 포함
  places.forEach((place) => {
    bounds.extend(new window.kakao.maps.LatLng(Number(place.y), Number(place.x)));
  });

  map.setBounds(bounds);
}, [map, currentPosition, places]);


  return (
    <div className="kakao-search-container">
      <h3 className="keyword-title">“{keyword}” 검색 결과</h3>

      <div className="kakao-map">
        {currentPosition && (
          <Map
            center={currentPosition}
            level={3}
            style={{ width: "100%", height: "400px" }}
            onCreate={setMap}
            zoomable={false}           // 🔹 마우스 휠 확대/축소 막기
            zoomControl={true}
            zoomControlPosition={window.kakao.maps.ControlPosition.RIGHT}
          >
            <MapMarker position={currentPosition}>
              <div style={{ color: "#000" }}>📍 현재 위치</div>
            </MapMarker>
            {places.map((place, i) => (
              <MapMarker
                key={i}
                position={{ lat: Number(place.y), lng: Number(place.x) }}
              >
                <div style={{ color: "#000" }}>{place.place_name}</div>
              </MapMarker>
            ))}
          </Map>
        )}
      </div>

      <ul className="kakao-place-list">
        {places.length === 0 ? (
          <p>🔍 검색 결과가 없습니다.</p>
        ) : (
          places.map((place, i) => (
            <li
              key={i}
              className="kakao-place-item"
              onClick={() => setSelectedPlace(place)}
              style={{ cursor: "pointer" }}
            >
              <strong>{place.place_name}</strong>
              <p>{place.road_address_name || place.address_name}</p>
              <p>📞 {place.phone || "전화번호 없음"}</p>
              <p>📏 거리: {place.distance}m</p> {/* ✅ 거리 표시 */}
            </li>
          ))
        )}
      </ul>

      {/* 모달 */}
      <PlaceDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default KakaoCategorySearch;

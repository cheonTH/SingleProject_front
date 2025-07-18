import React, { useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import "./Kakao.css";
import PlaceDetailModal from "./PlaceDetailModel";

const KakaoCategorySearch = ({ keyword, isAdmin }) => {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
    const toRad = (x) => (x * Math.PI) / 180;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lng2 - lng1);

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  };

  useEffect(() => {
    document.body.style.overflow = selectedPlace ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPlace]);

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
        setCurrentPosition({ lat: 37.5665, lng: 126.978 });
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
            .filter((p) => p.distance <= 550)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);

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
    bounds.extend(new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng));
    places.forEach((place) => {
      bounds.extend(new window.kakao.maps.LatLng(Number(place.y), Number(place.x)));
    });
    map.setBounds(bounds);
  }, [map, currentPosition, places]);

  return (
    <div className="kakao-fixed-layout">
      {/* 상단 지도 영역 */}
      <div className="map-section">
        <h3 className="keyword-title">“{keyword}” 검색 결과</h3>
        <div className="kakao-map">
          {currentPosition && (
            <Map
              center={currentPosition}
              level={3}
              style={{ width: "100%", height: "400px" }}
              onCreate={setMap}
              zoomable={false}
              zoomControl={true}
              zoomControlPosition={window.kakao.maps.ControlPosition.RIGHT}
            >
              <MapMarker position={currentPosition} />
              <CustomOverlayMap position={currentPosition} yAnchor={1.5}>
                <div className="current-location-pin">🚩 현재 위치</div>
              </CustomOverlayMap>

              {places.map((place, i) => {
                const offset = i * 0.00005;
                const adjustedLat = Number(place.y) + offset;
                const adjustedLng = Number(place.x);

                return (
                  <React.Fragment key={i}>
                    <MapMarker
                      position={{ lat: adjustedLat, lng: adjustedLng }}
                      onMouseOver={() => setHoverIndex(i)}
                      onMouseOut={() => setHoverIndex(null)}
                    />
                    {hoverIndex === i && (
                      <CustomOverlayMap
                        position={{ lat: adjustedLat, lng: adjustedLng }}
                        yAnchor={2.3}
                      >
                        <div className="category-loaction-pin">
                          {place.place_name}
                        </div>
                      </CustomOverlayMap>
                    )}
                  </React.Fragment>
                );
              })}
            </Map>
          )}
        </div>
      </div>

      {/* 아래 리스트 영역 */}
      <div className="list-section">
        <ul className="kakao-place-list">
          {places.length === 0 ? (
            <p>🔍 검색 결과가 없습니다.</p>
          ) : (
            places.map((place, i) => (
              <li
                key={i}
                className="kakao-place-item"
                onClick={() => setSelectedPlace(place)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{ cursor: "pointer" }}
              >
                <strong>{place.place_name}</strong>
                <p>{place.road_address_name || place.address_name}</p>
                <p>📞 {place.phone || "전화번호 없음"}</p>
                <p>📏 거리: {place.distance}m</p>
              </li>
            ))
          )}
        </ul>
      </div>

      <PlaceDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default KakaoCategorySearch;

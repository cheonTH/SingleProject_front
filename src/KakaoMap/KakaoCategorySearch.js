import React, { useContext, useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import "./Kakao.css";
import PlaceDetailModal from "./PlaceDetailModel";
import LocationContext from "./LocationContext";

const KakaoCategorySearch = ({ keyword, isAdmin }) => {
  const {
    currentPosition,
    setCurrentPosition,
    selectedAddress,
    setSelectedAddress,
    isCustomLocation,
    setIsCustomLocation,
  } = useContext(LocationContext); // ✅ Context 사용

  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [showSearchPopup, setShowSearchPopup] = useState(false);

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

  // body scroll lock
  useEffect(() => {
    document.body.style.overflow = selectedPlace ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPlace]);

  // 키워드 검색
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

  // 검색 결과로 bounds 조정
  useEffect(() => {
    if (!map || !currentPosition || places.length === 0) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    bounds.extend(new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng));
    places.forEach((place) => {
      bounds.extend(new window.kakao.maps.LatLng(Number(place.y), Number(place.x)));
    });
    map.setBounds(bounds);
  }, [map, currentPosition, places]);

  // 위치 설정
  const handleAddressSubmit = () => {
    if (!addressInput.trim()) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(addressInput, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        const { y, x, address_name } = result[0];
        setCurrentPosition({ lat: parseFloat(y), lng: parseFloat(x) });
        setSelectedAddress(address_name);
        setIsCustomLocation(true);
        setShowModal(false);
      } else {
        setShowSearchPopup(true);
        setTimeout(() => {
          setShowSearchPopup(false);
        }, 1000);
      }
    });
  };

  return (
    <div className="kakao-category-container">
      <div className="map-section">
        <div className="location-header">
          <h3 className="keyword-title">“{keyword}” 검색 결과</h3>
          <button className="set-location-btn" onClick={() => setShowModal(true)}>
            위치 설정
          </button>
        </div>
        {selectedAddress && (
          <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "-5px" }}>📍 설정된 위치: {selectedAddress}</p>
        )}
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

      {/* 리스트 영역 */}
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

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h4>주소 또는 장소명으로 위치 설정</h4>
            <input
              type="text"
              placeholder="예: 상세주소 혹은 시, 구, 동(읍)"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleAddressSubmit}>설정</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {showSearchPopup && (
        <div className="toast-popup">
          <span className="icon">❌</span>  {/* ← 원하는 이모지 넣기 */}
          <span className="text">장소 또는 주소를 찾을 수 없습니다.</span>
        </div>
      )}
    </div>
  );
};

export default KakaoCategorySearch;

import React, { useContext, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import "./Kakao.css";
import LocationContext from "./LocationContext";

const CurrentLocationMap = () => {
  const {
    currentPosition,
    setCurrentPosition,
    selectedAddress,
    setSelectedAddress,
    isCustomLocation,
    setIsCustomLocation,
  } = useContext(LocationContext);

  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [showSearchPopup, setShowSearchPopup] = useState(false);

  // 지도 로딩 상태
  React.useEffect(() => {
    if (currentPosition) setLoaded(true);
  }, [currentPosition]);

  const handleAddressSubmit = () => {
    if (!addressInput.trim()) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(addressInput, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        const { y, x, address_name } = result[0];
        setCurrentPosition({ lat: parseFloat(y), lng: parseFloat(x) });
        setSelectedAddress(address_name);
        setShowModal(false);
        setIsCustomLocation(true);
        setLoaded(true);
      } else {
        setShowSearchPopup(true);
        setTimeout(() => {
          setShowSearchPopup(false);
        }, 1000);
      }
    });
  };

  return (
    <div className="kakao-search-container">
      <div className="location-header">
        <h3 className="keyword-title">🚩 현재 위치</h3>
        <button className="set-location-btn" onClick={() => setShowModal(true)}>
          위치 설정
        </button>
      </div>

      {selectedAddress && (
        <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "-5px" }}>
          📍 설정된 위치: {selectedAddress}
        </p>
      )}

      <div className="kakao-map">
        {currentPosition && (
          <Map
            center={currentPosition}
            style={{ width: "100%", height: "400px" }}
            level={3}
            zoomable={false}
            zoomControl={true}
            zoomControlPosition={window.kakao.maps.ControlPosition.RIGHT}
          >
            {loaded && (
              <>
                <MapMarker position={currentPosition} />
                <CustomOverlayMap position={currentPosition} yAnchor={1.5}>
                  <div className="current-location-pin">
                    🚩 {selectedAddress || "현재 위치"}
                  </div>
                </CustomOverlayMap>
              </>
            )}
          </Map>
        )}
      </div>

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

export default CurrentLocationMap;

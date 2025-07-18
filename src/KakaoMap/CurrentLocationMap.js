import React, { useEffect, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import "./Kakao.css"; // 기존 스타일 재사용

const CurrentLocationMap = () => {
  const [position, setPosition] = useState({
    lat: 37.5665,
    lng: 126.978,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("브라우저가 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoaded(true);
      },
      (err) => {
        console.error("위치 정보를 가져오는 데 실패했습니다:", err);
        setLoaded(true); // fallback 위치라도 표시
      }
    );
  }, []);

  return (
    <div className="kakao-search-container">
      <h3 className="keyword-title">🚩 현재 위치</h3>
      <div className="kakao-map">
        <Map 
          center={position} 
          style={{ width: "100%", height: "400px" }} 
          level={3} 
          zoomable={false} 
          zoomControl={true}
          zoomControlPosition={window.kakao.maps.ControlPosition.RIGHT}>
          {loaded && (
            <>
              <MapMarker position={position} />
              <CustomOverlayMap position={position} yAnchor={1.5}>
                <div className="current-location-pin">🚩 현재 위치</div>
              </CustomOverlayMap>
            </>
            
          )}
        </Map>
      </div>
    </div>
  );
};

export default CurrentLocationMap;

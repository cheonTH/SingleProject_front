import { Map, MapMarker } from "react-kakao-maps-sdk";

export default function KakaoMap() {
  return (
    <Map
      center={{ lat: 37.5665, lng: 126.978 }}
      style={{ width: "100%", height: "400px" }}
      level={3}
    >
      <MapMarker position={{ lat: 37.5665, lng: 126.978 }}>
        <div>여기가 서울입니다</div>
      </MapMarker>
    </Map>
  );
}
import KakaoCategorySearch from "../KakaoMap/KakaoCategorySearch";
import CurrentLocationMap from "../KakaoMap/CurrentLocationMap";
import MainTipBoard from "./MainTipBoard";

function MainPage({ selectedMenu }) {
  return (
    <>
      {selectedMenu === "/" && (
        <div>
          <CurrentLocationMap />
          <MainTipBoard />
        </div>
        )}
      {selectedMenu === "/hunbab" && <KakaoCategorySearch keyword="혼밥" />}
      {selectedMenu === "/coinwash" && <KakaoCategorySearch keyword="코인 세탁방" />}
      {selectedMenu === "/cafe" && <KakaoCategorySearch keyword="카페" />}
    </>
  );
}

export default MainPage
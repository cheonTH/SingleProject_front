import KakaoCategorySearch from "../KakaoMap/KakaoCategorySearch";
import CurrentLocationMap from "../KakaoMap/CurrentLocationMap";
import MainTipBoard from "./MainTipBoard";

function MainPage({ selectedMenu, isAdmin }) {
  return (
    <>
      {selectedMenu === "/" && (
        <div>
          <CurrentLocationMap />
          <MainTipBoard />
        </div>
        )}
      {selectedMenu === "/hunbab" && <KakaoCategorySearch keyword="혼밥" isAdmin={isAdmin}/>}
      {selectedMenu === "/coinwash" && <KakaoCategorySearch keyword="코인 세탁방" isAdmin={isAdmin}/>}
      {selectedMenu === "/cafe" && <KakaoCategorySearch keyword="카페" isAdmin={isAdmin}/>}
    </>
  );
}

export default MainPage
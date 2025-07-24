// src/context/LocationContext.js
import React, { createContext, useState, useEffect } from "react";

// 1. Context 생성
const LocationContext = createContext();

// 2. Provider 정의
export const LocationProvider = ({ children }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isCustomLocation, setIsCustomLocation] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation || isCustomLocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setSelectedAddress("현재 위치");
      },
      () => {
        setCurrentPosition({ lat: 37.5665, lng: 126.978 });
        setSelectedAddress("서울시청 (기본값)");
      }
    );
  }, [isCustomLocation]);

  return (
    <LocationContext.Provider
      value={{
        currentPosition,
        setCurrentPosition,
        selectedAddress,
        setSelectedAddress,
        isCustomLocation,
        setIsCustomLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;

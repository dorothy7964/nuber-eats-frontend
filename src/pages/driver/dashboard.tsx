import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

interface ICoords {
  lat: number;
  lng: number;
}

const defaultCenter: ICoords = { lat: 36.7298624, lng: 127.1092041 };
const containerStyle = { width: "100%", height: "50vh" };

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>(defaultCenter);
  const mapRef = useRef<google.maps.Map | null>(null);

  /* Google Maps API 로드 */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey
  });

  /* ⭕ 위치 추적 성공 시 실행 */
  const onSuccess = ({
    coords: { latitude, longitude }
  }: GeolocationPosition) => {
    const newCoords = { lat: latitude, lng: longitude };
    setDriverCoords(newCoords);
    console.log("📢 위치 업데이트:", newCoords);

    // 지도 중심 이동
    if (mapRef.current) {
      mapRef.current.panTo(newCoords);
    }
  };

  /* ❌ 위치 추적 실패 시 실행 */
  const onError = (error: GeolocationPositionError) => {
    console.error("📢 위치 추적 오류:", error);
  };

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /* 지도 로드 완료 시 실행 */
  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    console.log("📢 Google Maps API 로드 완료");
  };

  if (!isLoaded) return <div>구글 맵 로딩 중...</div>;

  return (
    <div className="overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={driverCoords}
        zoom={16}
        onLoad={onLoad} // 지도 로드 시 실행
      />
    </div>
  );
};

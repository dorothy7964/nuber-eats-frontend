import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

interface ICoords {
  lat: number;
  lng: number;
}

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lat: 37.7298624,
    lng: 127.1092041
  });

  // @ts-ignore
  const onSucces = ({ coords: { latitude, longitude } }: Position) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  // @ts-ignore
  const onError = (error: PositionError) => {
    console.log(error);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true
    });
  }, []);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    // map: 현재 표시되는 지도 객체
    // maps: Google Maps JavaScript API 전체 객체

    setTimeout(() => {
      map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    }, 3000);
  };

  return (
    <>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={16}
          defaultCenter={{ lat: 36.7298624, lng: 127.1092041 }} // 중심 좌표
          bootstrapURLKeys={{ key: apiKey }}
        />
      </div>
    </>
  );
};

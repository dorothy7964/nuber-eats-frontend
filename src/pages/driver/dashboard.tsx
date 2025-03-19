import { gql, useSubscription } from "@apollo/client";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { CoockedOrdersSubscription } from "../../__generated__/types";
import { ButtonLink } from "../../components/buttonLink";
import { FULL_ORDER_FRAGMENT } from "../../fragments";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

const COOCKED_ORDERS_SUBSCRIPTION = gql`
  subscription coockedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

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

      // 주소를 좌표(위도, 경도)로 변환하는 API
      /* 
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(newCoords.lat, newCoords.lng)
        },
        (results, status) => {
          console.log("📢🟩 results [dashboard.tsx:41]", results);
          console.log("📢🟩 status [dashboard.tsx:41]", status);
        }
      );
      */
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
  /* 길찾기 */
  const makeRoute = () => {
    if (mapRef.current) {
      // DirectionsService와 DirectionsRenderer 초기화
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: { strokeColor: "orange" }
      });
      directionsRenderer.setMap(mapRef.current);

      // ! 🚨 Google Maps Directions API 대한민국에서 대중교통(TRANSIT)만 지원
      // 운전(DRIVING), 도보(WALKING), 자전거(BICYCLING) 모드는 제한되어 있다.
      // 다른 나라의 대부분 도시는 DRIVING 모드를 지원한다.
      // 국내 지도 API 사용 → 카카오맵, 네이버 지도, 티맵 API 등을 활용하기

      // 경로 요청
      directionsService.route(
        {
          // 출발지
          origin: driverCoords,
          // 목적지 : 아니키아 카페
          destination: { lat: 37.7283696, lng: 127.1140292 }, // 목적지
          travelMode: google.maps.TravelMode.TRANSIT // 이동 모드 (대중교통)
        },
        // DirectionsService로 경로 요청 후 결과 표시
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            console.log("📢 [dashboard.tsx:96] 경로 결과:", result);
            directionsRenderer.setDirections(result);
          } else {
            console.error("📢 [dashboard.tsx:96] 경로 오류 발생:", status);
            // `ZERO_RESULTS`인 경우 지도에 오류 메시지 표시하거나, 다른 경로를 찾는 방법도 고려
          }
        }
      );
    }
  };

  /* COOCKED_ORDERS_SUBSCRIPTION  */
  const { data: coockedOrdersData } =
    useSubscription<CoockedOrdersSubscription>(COOCKED_ORDERS_SUBSCRIPTION);

  useEffect(() => {
    // 조리 완료된 주문이 배달을 기다리는다는 것을 의미
    if (coockedOrdersData?.cookedOrders.id) {
      console.log(
        "📢 COOCKED_ORDERS_SUBSCRIPTION [dashboard.tsx:124]",
        coockedOrdersData
      );
      makeRoute();
    }
  }, [coockedOrdersData]);

  const newCookedOrder = coockedOrdersData?.cookedOrders.restaurant;

  if (!isLoaded) return <div>구글 맵 로딩 중...</div>;

  return (
    <>
      <div className="overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={driverCoords}
          zoom={16}
          onLoad={onLoad} // 지도 로드 시 실행
        >
          {/* 🚖 택시 마커 추가 */}
          {/* <Marker
          position={driverCoords}
          icon={{
            url: "", // 마커 배경
            scaledSize: new window.google.maps.Size(50, 50) // 아이콘 크기 조절
          }}
          label={{
            text: "🚖",
            fontSize: "25px",
            color: "white",
            fontWeight: "bold"
          }}
        /> */}
        </GoogleMap>
      </div>

      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {/* 신규 조리 완료 */}
        {newCookedOrder && (
          <>
            <h1 className="text-center text-3xl font-medium">
              신규 조리 완료 주문
            </h1>
            <h2 className="text-center my-3 text-xl font-medium">
              빠르게 수령해 주세요. @{" "}
              {coockedOrdersData?.cookedOrders.restaurant?.name}
            </h2>

            <ButtonLink
              className="btn w-full  block  text-center mt-5"
              text="배달 수락"
              bgColor="bg-lime-600"
              isArrowVisible={true}
              toLink={`/order/${coockedOrdersData?.cookedOrders.id}`}
            />
          </>
        )}

        {/* 신규 조리 완료 없음 */}
        {!newCookedOrder && (
          <h1 className="text-center text-3xl font-medium">
            아직 주문이 없습니다...
          </h1>
        )}
      </div>
    </>
  );
};

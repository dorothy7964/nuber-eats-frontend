import GoogleMapReact from "google-map-react";

export const Dashboard = () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

  return (
    <>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          defaultZoom={16}
          defaultCenter={{ lat: 37.5665, lng: 126.978 }} // 중심 좌표
          bootstrapURLKeys={{ key: apiKey }}
        />
      </div>
    </>
  );
};

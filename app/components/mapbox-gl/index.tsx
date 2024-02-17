import useMap from "./useMap";
import { ClientOnly } from "remix-utils/client-only";

export default function MapboxGL() {
  return <ClientOnly>{() => <Map />}</ClientOnly>;
}

const Map = () => {
  const mapContainer = useMap();

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="h-full" />
    </div>
  );
};

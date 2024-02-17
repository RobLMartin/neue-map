import MapboxGL from "~/components/mapbox-gl";

export const loader = async () => {
  const Mapbox_key = process.env.MAPBOX_KEY;
  return { Mapbox_key };
};

export default function Dashboard() {
  return (
    <div>
      <div className="flex">
        <div className="w-full h-[calc(100vh-71px)] ">
          <MapboxGL />
        </div>
      </div>
    </div>
  );
}

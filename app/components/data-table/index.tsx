import { useNavigate, useRouteLoaderData, useParams } from "@remix-run/react";

export default function DataTable() {
  const { dataset } = useRouteLoaderData<any>("routes/_app.$datasetId");
  const { datasetId } = useParams();
  const navigate = useNavigate();
  if (!dataset?.data) {
    return (
      <div className="grid place-content-center items-center justify-center h-full">
        No Records with this filter.
      </div>
    );
  }
  const handleNavigation = (coordinates: any[]) => {
    const [lat, long] = coordinates;
    navigate(`/${datasetId}?lat=${lat}&long=${long}`);
  };

  return (
    <table className="w-full">
      <thead className="sticky top-0 left-0 dark:bg-neutral-800 bg-white shadow">
        <tr>
          {dataset.data.features.length > 0 &&
            Object.keys(dataset.data.features[0].properties).map((key) => (
              <th
                key={key}
                className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-r last:border-r-0 dark:border-neutral-700"
              >
                {key}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {dataset.data.features.map((feature: any, idx: number) => (
          <tr
            key={idx}
            onClick={() => handleNavigation(feature.geometry.coordinates)}
            className="dark:hover:bg-neutral-800 hover:bg-gray-100 cursor-pointer transition-all ease-in-out duration-100"
          >
            {Object.values(feature.properties ?? {}).map(
              (value: any, valueIdx: number) => (
                <td
                  key={valueIdx}
                  className="px-6 py-4 whitespace-nowrap text-md border-r border-b last:border-r-0  dark:border-neutral-700"
                >
                  {value}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

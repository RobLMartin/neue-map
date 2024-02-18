import { getDatasets } from "~/data/dataset.server";
import { useLoaderData, useNavigate } from "@remix-run/react";
import useLocalStorageOptions from "~/hooks/useLocalStorageOptions";

export const loader = async () => {
  const datasets = await getDatasets({
    id: true,
    name: true,
    createdAt: true,
  });
  return datasets;
};

export default function DatasetsPage() {
  const datasets = useLoaderData<typeof loader>();
  const { options, addOption } = useLocalStorageOptions("datasetOptions");
  const navigate = useNavigate();
  const handleClick = (option: { label: string; value: number }) => {
    const isOptionAlreadyAdded = options.some(
      (opt) => opt.value === option.value
    );

    if (!isOptionAlreadyAdded) {
      addOption(option);
    }
    navigate(`/${option.value}`);
  };

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created At
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              View
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datasets.map((dataset: any) => (
            <tr key={dataset.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {dataset.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {dataset.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {dataset.createdAt}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium cursor-pointer">
                <div
                  onClick={() =>
                    handleClick({ label: dataset.name, value: dataset.id })
                  }
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

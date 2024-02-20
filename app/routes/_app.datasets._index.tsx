import { getDatasets } from "~/data/dataset.server";
import { useLoaderData, useNavigate, useFetcher } from "@remix-run/react";
import type { Dataset } from "@prisma/client";

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
  const createTabFetcher = useFetcher();
  const navigate = useNavigate();

  const handleClickViewDataset = (dataset: Partial<Dataset>) => {
    const { id, name } = dataset;
    const formData = new FormData();
    formData.append("tab", JSON.stringify({ id, name, intent: "create-tab" }));

    createTabFetcher.submit(formData, {
      method: "post",
      action: "/",
      navigate: false,
    });

    navigate(`/datasets/${id}`);
  };

  return (
    <div>
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="sticky top-0 left-0 dark:bg-neutral-800 bg-neutral-100">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider border-b border-r last:border-r-0 dark:border-neutral-700"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider border-b border-r last:border-r-0 dark:border-neutral-700"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider border-b border-r last:border-r-0 dark:border-neutral-700"
            >
              Created At
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider border-b border-r last:border-r-0 dark:border-neutral-700"
            >
              View
            </th>
          </tr>
        </thead>
        <tbody className="">
          {datasets.map((dataset: any) => (
            <tr
              key={dataset.id}
              className="dark:hover:bg-neutral-800 hover:bg-neutral-100 transition-all ease-in-out duration-100"
            >
              <td className="px-6 py-4 whitespace-nowrap text-md border-r border-b last:border-r-0  dark:border-neutral-700">
                {dataset.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-md border-r border-b last:border-r-0  dark:border-neutral-700">
                {dataset.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-md border-r border-b last:border-r-0  dark:border-neutral-700">
                {new Date(dataset.createdAt).toLocaleString()}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-md border-r border-b last:border-r-0  dark:border-neutral-700 cursor-pointer">
                <div
                  onClick={() =>
                    handleClickViewDataset({
                      name: dataset.name,
                      id: dataset.id,
                    })
                  }
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 font-semibold"
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
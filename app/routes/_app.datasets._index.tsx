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
    if (!id || !name) return;
    formData.append("id", id.toString());
    formData.append("name", name);
    formData.append("intent", "create-tab");
    createTabFetcher.submit(
      { id, name, intent: "create-tab" },
      {
        method: "post",
        action: "/",
        navigate: false,
      }
    );

    navigate(`/datasets/${id}`);
  };

  return (
    <div className="flex h-[calc(100vh-71px)] w-[calc(100vw-78px)]">
      <div className="w-full overflow-x-auto">
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
              {/* <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider border-b border-r last:border-r-0 dark:border-neutral-700"
              >
                Open
              </th> */}
            </tr>
          </thead>
          <tbody className="">
            {datasets.map((dataset: any) => (
              <tr
                onClick={() =>
                  handleClickViewDataset({
                    name: dataset.name,
                    id: dataset.id,
                  })
                }
                key={dataset.id}
                className="dark:hover:bg-neutral-800 hover:bg-neutral-100 cursor-pointer transition-all ease-in-out duration-100"
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

                {/* <td className="px-6 py-4 whitespace-nowrap text-md border-r border-b last:border-r-0  dark:border-neutral-700 cursor-pointer">
                  <div
                    onClick={() =>
                      handleClickViewDataset({
                        name: dataset.name,
                        id: dataset.id,
                      })
                    }
                    className=" hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
                  >
                    <ArrowRightIcon height={20} width={20} />
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

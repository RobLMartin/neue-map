import { getDatasets } from "~/data/dataset.server";

export const loader = async () => {
  const datasets = await getDatasets({
    id: true,
    name: true,
  });

  return { datasets };
};

import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import DropZone from "~/components/drop.zone";
import { getDatasetById } from "~/data/dataset.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { datasetId } = params;
  if (!Number(datasetId) || !datasetId) {
    return redirect("/");
  } else {
    const dataset = await getDatasetById(datasetId);
    if (!dataset) {
      return redirect("/");
    }
    return { dataset };
  }
};

export default function AppDatasetLayout() {
  return (
    <div>
      <DropZone />
      <Outlet />
    </div>
  );
}

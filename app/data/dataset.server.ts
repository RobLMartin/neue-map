import type { Dataset } from "@prisma/client";
import type { JsonObject } from "@prisma/client/runtime/library";
import { db } from "~/services/db.server";

export async function getDatasetById(id: string) {
  try {
    const datasetId = Number(id);
    const dataset = await db.dataset.findUnique({
      where: { id: datasetId },
    });

    return dataset;
  } catch (error) {
    console.error("Error fetching dataset:", error);
    return error;
  }
}

export async function getDatasets(
  select: Partial<Record<keyof Dataset, boolean>>
): Promise<Partial<Dataset>[]> {
  try {
    const dataset = await db.dataset.findMany({
      select,
    });
    console.log("Datasets:", dataset);
    return dataset;
  } catch (error: any) {
    console.error("Error fetching dataset:", error);
    return error;
  }
}

export async function renameDataset(id: string, name: string) {
  try {
    const datasetId = Number(id);
    const dataset = await db.dataset.update({
      where: { id: datasetId },
      data: { name },
    });

    return dataset;
  } catch (error) {
    console.error("Error renaming dataset:", error);
    return error;
  }
}

export async function createDataset(dataString: string) {
  try {
    const createdAt = new Date();
    const data = JSON.parse(dataString) as unknown as JsonObject;

    const dataset = await db.dataset.create({
      data: {
        data,
        name: createdAt.toISOString(),
      },
    });
    console.log("Dataset created:", dataset.id);
    const id = dataset.id;
    return new Response(JSON.stringify({ datasetId: id.toString() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error saving data:", err.message, err);
    return new Response("Failed to save data", { status: 500 });
  }
}

import type { ActionFunctionArgs } from "@remix-run/node";
import { createDataset } from "~/data/dataset.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const dataString = formData.get("data");

  if (typeof dataString !== "string" || !dataString) {
    return new Response("No valid data found", { status: 400 });
  }

  try {
    return await createDataset(dataString);
  } catch (err) {
    console.error("Error parsing JSON:", err);
    return new Response("Invalid JSON format", { status: 400 });
  }
};

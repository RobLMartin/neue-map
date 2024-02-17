import type { ActionFunctionArgs } from "@remix-run/node";
import { renameDataset } from "~/data/dataset.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const id = formData.get("id");

  if (typeof name !== "string" || !name) {
    return new Response("Name is invalid.", { status: 400 });
  }

  if (typeof id !== "string" || !id) {
    return new Response("No id.", { status: 400 });
  }

  try {
    return await renameDataset(id, name);
  } catch (err) {
    console.error("Error parsing JSON:", err);
    return new Response("Invalid JSON format", { status: 400 });
  }
};

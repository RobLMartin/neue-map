import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  type ClientActionFunctionArgs,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "tailwind.css";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Dataset } from "@prisma/client";
import { addOption, options, removeOption } from "~/utils/tab.storage";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent") as string | null;
  const tabString = formData.get("tab") as string | null;
  const removeId = formData.get("id") as string | null;

  if (intent === "delete" && removeId) {
    const id = Number(removeId);
    removeOption(id);
    return 200;
  }

  if (!tabString) {
    return 200;
  }

  const tab = JSON.parse(tabString) as Partial<Dataset>;

  const datasetExists = options.some(
    (d: { value: string | number }) => d.value === tab.id
  );

  if (!datasetExists) {
    addOption({ value: tab.id!, label: tab.name! });
  }

  return 200;
};

export default function App() {
  return (
    <html
      lang="en"
      className="bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="hidden md:block">
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </div>

        <div className="md:hidden grid place-items-center h-screen w-screen">
          <p className="text-xl">
            Please view this application on a larger screen.
          </p>
        </div>
      </body>
    </html>
  );
}

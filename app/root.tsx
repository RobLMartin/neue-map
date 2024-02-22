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
import { addTab, removeTabById, updateTabLabel } from "~/utils/tab.storage";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "delete-tab") {
    const removeId = formData.get("id") as string;
    removeTabById(removeId);
  } else if (intent === "create-tab") {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;

    addTab({ value: id!, label: name! });
  } else if (intent === "update-tab") {
    const id = formData.get("id") as string;
    const newLabel = formData.get("name") as string;

    updateTabLabel(id, newLabel);
  }

  return null;
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

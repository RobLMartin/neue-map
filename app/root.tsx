import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "tailwind.css";
import "mapbox-gl/dist/mapbox-gl.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

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

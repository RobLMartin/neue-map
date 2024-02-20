import { Outlet } from "@remix-run/react";
import Topbar from "~/components/topbar";
import Sidebar from "~/components/sidebar";
import { fetchOptions } from "~/utils/tab.storage";

export const clientLoader = async () => {
  const options = fetchOptions();
  return { options };
};

export default function App() {
  return (
    <div className="border-b dark:border-neutral-700">
      <Topbar />
      <div className="container mx-auto flex">
        <div className="w-auto border-x dark:border-neutral-700">
          <Sidebar />
        </div>
        <div className="w-full border-r dark:border-neutral-700">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

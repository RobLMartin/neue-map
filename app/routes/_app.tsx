import { Outlet } from "@remix-run/react";
import Topbar from "~/components/topbar";
import Sidebar from "~/components/sidebar";
import { fetchTabs } from "~/utils/tab.storage";

export const clientLoader = async () => {
  const tabs = fetchTabs();
  return { tabs };
};

export default function App() {
  return (
    <div className="border-b dark:border-neutral-700">
      <Topbar />
      <div className="flex">
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

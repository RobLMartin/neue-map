import { Cross2Icon } from "@radix-ui/react-icons";
import {
  useFetcher,
  NavLink,
  useParams,
  useLoaderData,
} from "@remix-run/react";
import { useEffect, useState, useRef } from "react";

type Tab = { value: number; label: string };

const DatasetTabs = () => {
  const { datasetId } = useParams();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const editInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const datasetFetcher = useFetcher();
  const editNameFetcher = useFetcher();
  const editTabFetcher = useFetcher();
  const tabFetcher = useFetcher();
  const { tabs } = useLoaderData<any>();

  useEffect(() => {
    if (datasetFetcher.state === "idle" && !datasetFetcher.data) {
      datasetFetcher.load("/dataset/find");
    }
  }, [datasetFetcher, datasetId]);

  useEffect(() => {
    if (editingIndex !== null) {
      editInputRefs.current[editingIndex]?.focus();
    }
  }, [editingIndex]);

  const handleEditChange = (e: any) => {
    setEditingName(e.target.value);
  };

  const handleRemoveTab = (value: number) => {
    tabFetcher.submit(
      { id: value, intent: "delete-tab" },
      { method: "post", action: "/" }
    );
  };

  const handleEditConfirm = (e: any, index: number, tab: Tab) => {
    if (e.key === "Enter") {
      setEditingIndex(null);

      const formData = new FormData();
      formData.append("id", tab.value.toString());
      formData.append("name", editingName);

      editNameFetcher.submit(formData, {
        method: "put",
        action: "/dataset/edit",
        navigate: false,
      });
      editTabFetcher.submit(
        { id: tab.value, name: editingName, intent: "update-tab" },
        { method: "post", action: "/" }
      );
    }
  };

  const handleEditConfirmOnBlur = (index: number, tab: Tab) => {
    setEditingIndex(null);

    const formData = new FormData();
    formData.append("id", tab.value.toString());
    formData.append("name", editingName);

    editNameFetcher.submit(formData, {
      method: "put",
      action: "/dataset/edit",
      navigate: false,
    });
    editTabFetcher.submit(
      { id: tab.value, name: editingName, intent: "update-tab" },
      { method: "post", action: "/" }
    );
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex whitespace-nowrap h-full">
        {tabs.map((tab: any, index: number) => (
          <>
            {editingIndex === index ? (
              <input
                ref={(el) => (editInputRefs.current[index] = el)}
                type="text"
                value={editingName}
                onChange={handleEditChange}
                onKeyPress={(e) => handleEditConfirm(e, index, tab)}
                onBlur={() => handleEditConfirmOnBlur(index, tab)}
                className="cursor-pointer p-4 flex-none items-center border-r dark:border-neutral-700 px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 ease-in-out focus:outline-none focus:bg-blue-50 focus:dark:bg-blue-800"
              />
            ) : (
              <NavLink
                key={tab.value}
                to={`/datasets/${tab.value}`}
                className={({ isActive }) => {
                  console.log(tab.value, isActive);
                  const commonStyles =
                    "cursor-pointer p-4 flex-none flex items-center border-r dark:border-neutral-700 gap-2 px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 ease-in-out";
                  if (isActive) {
                    return commonStyles + " bg-neutral-100 dark:bg-neutral-700";
                  } else {
                    return commonStyles;
                  }
                }}
              >
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setEditingIndex(index);
                    setEditingName(tab.label);
                  }}
                  className="cursor-pointer p-1 hover:bg-neutral-300 dark:hover:bg-neutral-900 transition-colors duration-200 ease-in-out rounded"
                >
                  {tab.label}
                </span>
                <button
                  onClick={() => handleRemoveTab(tab.value)}
                  className="p-2"
                >
                  <Cross2Icon />
                </button>
              </NavLink>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default DatasetTabs;

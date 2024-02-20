import { Cross2Icon } from "@radix-ui/react-icons";
import { useFetcher, Link, useParams, useLoaderData } from "@remix-run/react";
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
      const updatedTab = { ...tab, label: editingName };
      updateTab(index, updatedTab);
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
    const updatedTab = { ...tab, label: editingName };
    updateTab(index, updatedTab);
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

  const updateTab = (index: number, updatedTab: Tab) => {
    // Implement the logic to update the option in your state or data source
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex whitespace-nowrap h-full">
        {tabs.map((tab: any, index: number) => (
          <div
            key={tab.value}
            className="flex-none flex items-center border-r dark:border-neutral-700 gap-2 px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 ease-in-out"
          >
            {editingIndex === index ? (
              <input
                ref={(el) => (editInputRefs.current[index] = el)}
                type="text"
                value={editingName}
                onChange={handleEditChange}
                onKeyPress={(e) => handleEditConfirm(e, index, tab)}
                onBlur={() => handleEditConfirmOnBlur(index, tab)}
                className="text-left p-2 w-full dark:bg-neutral-700 bg-neutral-200 border-none focus:ring-0 focus:outline-none rounded"
              />
            ) : (
              <>
                <Link
                  to={`/datasets/${tab.value}`}
                  className="flex-1 cursor-pointer p-5"
                >
                  <span
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation
                      setEditingIndex(index);
                      setEditingName(tab.label);
                    }}
                    className="cursor-pointer p-1 hover:bg-neutral-300 dark:hover:bg-neutral-900 transition-colors duration-200 ease-in-out rounded"
                  >
                    {tab.label}
                  </span>
                </Link>
                <button
                  onClick={() => handleRemoveTab(tab.value)}
                  className="p-2"
                >
                  <Cross2Icon />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatasetTabs;

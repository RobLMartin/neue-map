import { Cross2Icon } from "@radix-ui/react-icons";
import { useFetcher, Link, useLocation, useParams } from "@remix-run/react";
import { useEffect, useState, useRef } from "react";
import useLocalStorageOptions from "~/hooks/useLocalStorageOptions";

type Option = { value: number; label: string };

const DatasetTabs = () => {
  const location = useLocation();
  const { datasetId } = useParams();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const editInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const datasetFetcher = useFetcher();
  const editNameFetcher = useFetcher();
  const { options, addOption, removeOption } =
    useLocalStorageOptions("datasetOptions");

  useEffect(() => {
    if (datasetFetcher.state === "idle" && !datasetFetcher.data) {
      datasetFetcher.load("/dataset/find");
    }
  }, [datasetFetcher, datasetId, addOption]);

  useEffect(() => {
    if (editingIndex !== null) {
      editInputRefs.current[editingIndex]?.focus();
    }
  }, [editingIndex]);

  const handleEditChange = (e: any) => {
    setEditingName(e.target.value);
  };

  const handleRemoveOption = (value: number) => {
    removeOption(value);
  };

  const handleEditConfirm = (e: any, index: number, option: Option) => {
    if (e.key === "Enter") {
      const updatedOption = { ...option, label: editingName };
      updateOption(index, updatedOption);
      setEditingIndex(null);

      const formData = new FormData();
      formData.append("id", option.value.toString());
      formData.append("name", editingName);

      editNameFetcher.submit(formData, {
        method: "put",
        action: "/dataset/edit",
        navigate: false,
      });
    }
  };

  const handleEditConfirmOnBlur = (index: number, option: Option) => {
    const updatedOption = { ...option, label: editingName };
    updateOption(index, updatedOption);
    setEditingIndex(null);

    const formData = new FormData();
    formData.append("id", option.value.toString());
    formData.append("name", editingName);

    editNameFetcher.submit(formData, {
      method: "put",
      action: "/dataset/edit",
      navigate: false,
    });
  };

  const updateOption = (index: number, updatedOption: Option) => {
    // Implement the logic to update the option in your state or data source
  };

  const pathSuffix = location.pathname.split("/").slice(2).join("/");

  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex whitespace-nowrap h-full">
        {options.map((option, index) => (
          <div
            key={option.value}
            className="flex-none flex items-center border-r dark:border-neutral-700 gap-2 pr-2"
          >
            {editingIndex === index ? (
              <input
                ref={(el) => (editInputRefs.current[index] = el)}
                type="text"
                value={editingName}
                onChange={handleEditChange}
                onKeyPress={(e) => handleEditConfirm(e, index, option)}
                onBlur={() => handleEditConfirmOnBlur(index, option)}
                className="text-left p-4 w-full border rounded"
              />
            ) : (
              <>
                <Link
                  to={`/${option.value}/${pathSuffix}`}
                  className="flex-1 cursor-pointer p-5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 ease-in-out"
                >
                  <span
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation
                      setEditingIndex(index);
                      setEditingName(option.label);
                    }}
                    className="cursor-pointer p-1 hover:bg-neutral-300 dark:hover:bg-neutral-900 transition-colors duration-200 ease-in-out rounded"
                  >
                    {option.label}
                  </span>
                </Link>
                <button
                  onClick={() => handleRemoveOption(option.value)}
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

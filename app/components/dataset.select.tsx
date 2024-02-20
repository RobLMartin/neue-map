import { useFetcher, Link, useLocation, useParams } from "@remix-run/react";
import { useEffect, useState, useRef } from "react";
type Dataset = { id: number; name: string };
type FetcherData = { datasets: Dataset[] };

type Option = { value: number; label: string };

const DatasetSelect = () => {
  const location = useLocation();
  const { datasetId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const uploadFetcher = useFetcher();
  const editNameFetcher = useFetcher();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Trigger data loading if not already loading or loaded.
    if (uploadFetcher.state === "idle" && !uploadFetcher.data) {
      console.log("Initiating fetch for datasets.");
      uploadFetcher.load("/dataset/find");
    }

    // Handle successful data loading.
    if (uploadFetcher.state === "idle" && uploadFetcher.data) {
      const datasets = (uploadFetcher.data as FetcherData)?.datasets;
      if (datasets && datasets.length > 0 && datasetId) {
        const selected = datasets.find(
          (dataset) => dataset.id === Number(datasetId)
        );
        if (selected) {
          setSelectedOption({ value: selected.id, label: selected.name });
          setEditingName(selected.name);
        } else {
          // Handle case where datasetId is provided but no matching dataset is found.
          console.error("Selected dataset not found.");
          setSelectedOption(null);
          setEditingName("");
        }
      } else {
        // Handle case where no datasets are returned or no datasetId is provided.
        setSelectedOption(null);
        setEditingName("");
      }
    }
  }, [uploadFetcher, datasetId]);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (!selectedOption) return;
    setIsEditing(true);
  };

  const handleEditChange = (e: any) => {
    setEditingName(e.target.value);
  };

  const handleEditConfirm = (e: any) => {
    if (e.key === "Enter" && selectedOption) {
      const updatedOption = { ...selectedOption, label: editingName };
      setSelectedOption(updatedOption);
      setIsEditing(false);
      setIsOpen(false);

      const formData = new FormData();

      formData.append("id", selectedOption.value.toString());
      formData.append("name", editingName);

      editNameFetcher.submit(formData, {
        method: "put",
        action: "/dataset/edit",
        navigate: false,
      });
    }
  };

  const handleOnBlurConfirm = () => {
    if (!selectedOption) return;
    const updatedOption = { ...selectedOption, label: editingName };
    setSelectedOption(updatedOption);
    setIsEditing(false);

    const formData = new FormData();

    formData.append("id", selectedOption.value.toString());
    formData.append("name", editingName);

    editNameFetcher.submit(formData, {
      method: "put",
      action: "/dataset/edit",
      navigate: false,
    });
  };

  if (uploadFetcher.state === "loading")
    return (
      <div className="inline-flex justify-between items-center w-80 p-6 px-9 text-sm font-medium border-r dark:border-neutral-700">
        Loading...
      </div>
    );

  const options =
    (uploadFetcher.data as FetcherData)?.datasets.map((dataset) => ({
      value: dataset.id,
      label: dataset.name,
    })) || [];

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setEditingName(option.label);
    setIsOpen(false);
  };

  const pathSuffix = location.pathname.split("/").slice(2).join("/");

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left w-80 border-r dark:border-neutral-700"
    >
      <div className="flex gap-2 justify-between items-center w-full px-6 py-3 text-sm font-medium dark:text-white">
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editingName}
            onChange={handleEditChange}
            onKeyPress={handleEditConfirm}
            onBlur={handleOnBlurConfirm} // Optionally confirm on blur or just close the edit mode
            className="text-left p-3 w-full dark:bg-neutral-700 bg-neutral-200 border-none focus:ring-0 focus:outline-none rounded"
          />
        ) : (
          <div
            className={`text-left p-3 w-full ${
              selectedOption
                ? "dark:hover:bg-neutral-800 hover:bg-neutral-100 cursor-pointer rounded"
                : ""
            }`}
            onClick={handleEdit}
          >
            {selectedOption?.label || "Select Dataset"}
          </div>
        )}
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex items-center p-3 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 ease-in-out rounded"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <svg
            className={`h-5 w-5 transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        className={`absolute top-[68px] right-0 w-80 bg-white dark:bg-neutral-900 dark:border-neutral-700 border-l-0 border left-0 transform transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="py-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {options.map((option) => (
            <Link
              to={`/${option.value}/${pathSuffix}`}
              key={option.value}
              className="py-6 px-9 inline-block text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer w-full text-left border-b dark:border-neutral-700"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </Link>
          ))}
          {options.length === 0 && (
            <div className="py-6 px-9 text-sm w-full text-left">
              No datasets found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetSelect;

import { useEffect, useCallback, useState } from "react";
import { useFetcher, useNavigate } from "@remix-run/react";
import type { Dataset } from "@prisma/client";
import useDragAndDrop from "~/hooks/useDragAndDrop";

const DropZone = () => {
  const [uploadKey, setUploadKey] = useState(0);
  const createDatasetfetcher = useFetcher();
  const createTabFetcher = useFetcher();
  const navigate = useNavigate();

  const handleFileDrop = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (result) {
        createDatasetfetcher.submit(
          { data: JSON.stringify(JSON.parse(result as string)) },
          { method: "POST", action: "/dataset/create" }
        );
      }
    };
    reader.readAsText(file);
  };

  const { isDragging } = useDragAndDrop(handleFileDrop);

  const createTabAndNavigate = useCallback(
    (id?: number, name?: string) => {
      if (!id || !name) return;
      const formData = new FormData();
      formData.append(
        "tab",
        JSON.stringify({ id, name, intent: "create-tab" })
      );
      createTabFetcher.submit(formData, {
        method: "post",
        action: "/",
        navigate: false,
      });
      setUploadKey((prevKey: number) => prevKey + 1);
      navigate(`/datasets/${id}`);
    },
    [createTabFetcher, navigate]
  );

  useEffect(() => {
    if (
      createDatasetfetcher.state === "idle" &&
      createDatasetfetcher.data &&
      !createTabFetcher.data
    ) {
      const { id, name } = createDatasetfetcher.data as Partial<Dataset>;
      createTabAndNavigate(id, name);
      createDatasetfetcher.data = null;
      createTabFetcher.data = null;
    }
  }, [createDatasetfetcher, createTabFetcher, createTabAndNavigate]);

  return (
    <div key={`key-${uploadKey}`}>
      {isDragging ? (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="p-16 rounded dark:bg-neutral-900 bg-white shadow-lg"
            style={{ pointerEvents: "auto" }}
          >
            <p>Drop your GeoJSON file here</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DropZone;

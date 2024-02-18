import React, { useState, useEffect } from "react";
import { useFetcher, useNavigate } from "@remix-run/react";

type FetcherData = {
  datasetId?: string;
};
const DropZone = () => {
  const fetcher = useFetcher();
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data !== undefined) {
      const data = fetcher.data as FetcherData;
      if (data.datasetId) {
        navigate(`/${data.datasetId}`);
      }
    }
  }, [fetcher, navigate]);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      if (
        e.dataTransfer &&
        e.dataTransfer.items &&
        e.dataTransfer.items.length
      ) {
        setIsDragging(true);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault(); // This is crucial to prevent the browser from opening the file.
      setIsDragging(true); // Maintain visibility as long as we're dragging over the app.
    };

    const handleFileDrop = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result) {
          const data = JSON.parse(result as string);

          fetcher.submit(
            { data: JSON.stringify(data) },
            {
              method: "POST",
              action: "/dataset/create",
            }
          );
        }
      };
      reader.readAsText(file);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault(); // Prevent the browser default of opening the file.
      setIsDragging(false); // Hide the drop zone once the file is dropped.
      if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        handleFileDrop(file);
      }
    };

    // Bind events to the whole document to capture drag/drop anywhere
    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
    };
  }, [fetcher]);

  if (!isDragging) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      style={{ pointerEvents: "none" }} // Prevent the drop zone from capturing mouse events when visible.
    >
      <div
        className="p-16 rounded dark:bg-neutral-900 bg-white shadow-lg"
        style={{ pointerEvents: "auto" }} // Allow mouse events on the inner div to let the user drop the file.
      >
        <p>Drop your GeoJSON file here</p>
      </div>
    </div>
  );
};

export default DropZone;

import { useState, useEffect } from "react";

const useDragAndDrop = (onFileDropped: (file: File) => void) => {
  const [isDragging, setIsDragging] = useState(false);

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
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
        onFileDropped(e.dataTransfer.files[0]);
      }
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
    };
  }, [onFileDropped]);

  return { isDragging };
};

export default useDragAndDrop;

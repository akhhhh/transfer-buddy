"use client";

import { useState, DragEvent, ChangeEvent } from "react";

interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void;
}

export default function FileDropzone({ onFileSelect }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div className="w-full flex justify-center">
      <label
        htmlFor="fileInput"
        className={`
          w-full max-w-md h-55 flex flex-col justify-center items-center
          border-2 border-dashed rounded-xl cursor-pointer transition-all
          ${isDragging ? "border-blue-200 bg-blue-50" : "border-neutral-500"}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={handleFileInput}
        />

        {!selectedFile ? (
          <p className="text-neutral text-center">
            <span className="font-semibold">Click to upload</span> or drag &
            drop
            <br />
            <span className="text-sm text-neutral-400">Any file supported</span>
          </p>
        ) : (
          <p className="text-green-500 font-semibold text-xl">{selectedFile.name}</p>
        )}
      </label>
    </div>
  );
}

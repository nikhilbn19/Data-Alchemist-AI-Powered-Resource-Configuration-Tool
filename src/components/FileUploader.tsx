"use client";

import React from "react";
import { ParsedFileData } from "../types/types";

interface FileUploaderProps {
  onFileUpload: (file: File, fileType: keyof ParsedFileData) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const fileTypes: (keyof ParsedFileData)[] = ["clients", "workers", "tasks"];

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof ParsedFileData
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file, type);
      e.target.value = ""; // Clear to allow re-upload of same file
    }
  };

  return (
    <div className="flex gap-6 mb-6">
      {fileTypes.map((type) => (
        <div key={type} className="flex flex-col items-center">
          <label
            htmlFor={`file-${type}`}
            className="font-semibold mb-2 capitalize"
          >
            {type}.csv / .xlsx
          </label>
          <input
            id={`file-${type}`}
            type="file"
            accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(e) => handleFileChange(e, type)}
            className="border p-2 rounded cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
};

export default FileUploader;

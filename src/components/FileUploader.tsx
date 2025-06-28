"use client";

import React from 'react';

interface FileUploaderProps {
  onFileUpload: (file: File, fileType: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const fileTypes = ['clients', 'workers', 'tasks'];

  return (
    <div className="flex gap-6">
      {fileTypes.map((type) => (
        <div key={type} className="flex flex-col items-center">
          <label className="font-semibold mb-2 capitalize">{type}.csv / .xlsx</label>
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onFileUpload(file, type);
              }
            }}
            className="border p-2 rounded"
          />
        </div>
      ))}
    </div>
  );
};

export default FileUploader;

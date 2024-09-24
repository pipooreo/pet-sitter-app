"use client";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase.client";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

const uploadLimit = 5;

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    addFilesToState(selectedFiles);
  };

  const addFilesToState = (selectedFiles) => {
    if (files.length + selectedFiles.length > uploadLimit) {
      toast.error(`You can only upload up to ${uploadLimit} files.`);
      return;
    }

    const previewFiles = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFiles((prevFiles) => [...prevFiles, ...previewFiles]);
  };

  const handleUpload = async () => {
    if (!files.length) {
      toast.info("Please select or drop files to upload");
      return;
    }

    try {
      setUploading(true);

      const uploadedFiles = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i].file;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = fileName;

        // Upload to Supabase: if error occurs -> throw error
        let { error } = await supabase.storage
          .from("test")
          .upload(filePath, file);
        if (error) {
          throw error;
        }

        // Get public URL
        const { data } = supabase.storage.from("test").getPublicUrl(filePath);
        if (!data.publicUrl) {
          throw new Error("Failed to get public URL");
        }
        uploadedFiles.push(data.publicUrl);
      }

      // Send form data to backend as data: JSON.stringify({})
      const response = await fetch("/api/pet-sitter/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicUrls: uploadedFiles }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      //toast and reset
      toast.success("Images uploaded successfully.");
      setFiles([]);
    } catch (error) {
      toast.error("Error uploading files: " + error.message);
      console.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  //   const handleDragLeave = () => {
  //     e.preventDefault();
  //     setIsDragging(false);
  //   };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFilesToState(droppedFiles);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* File Previews on the Left */}
      <div className="flex flex-row gap-3">
        {files.map((fileObj, index) => (
          <div key={index} className="relative w-[167px] h-[167px] flex">
            <Image
              src={fileObj.preview}
              alt={`Preview ${index}`}
              width={167}
              height={167}
              className="object-cover w-full h-full"
            />
            <FaTimes
              className="absolute top-1 right-1 text-red cursor-pointer"
              onClick={() => handleRemoveImage(index)}
            />
          </div>
        ))}

        {/* upload btn */}
        <div
          onDragOver={handleDragOver}
          //   onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 ${
            isDragging ? "border-blue-500" : "border-gray-300"
          } p-3 text-center bg-white ${
            isDragging ? "bg-gray-100" : "bg-white"
          } cursor-pointer w-[167px] h-[167px] flex items-center justify-center`}
          onClick={() =>
            files.length < uploadLimit &&
            document.getElementById("fileInput").click()
          }
        >
          {isDragging ? (
            <p className="text-gray-500">Drop here...</p>
          ) : (
            <p className="text-gray-500">
              {files.length < uploadLimit
                ? "Drag & drop or click"
                : `Limit reached (${uploadLimit})`}
            </p>
          )}
        </div>
      </div>

      {/* Hidden file input for clicking */}
      <input
        id="fileInput"
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={files.length >= uploadLimit}
      />

      {/* submit btn */}
      <div>
        <button
          onClick={handleUpload}
          disabled={uploading || !files.length}
          className={`mt-5 px-4 py-2 rounded text-white ${
            uploading || !files.length
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 cursor-pointer"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;

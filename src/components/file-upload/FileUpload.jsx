"use client";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase.client";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

const uploadLimit = 10;

const FileUpload = () => {
  const [files, setFiles] = useState([]); // Side images
  const [profileImage, setProfileImage] = useState(null); // Profile image
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    addFilesToState(selectedFiles);
  };

  const addProfileImageToState = (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setProfileImage({
      file,
      preview,
    });
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
    if (!files.length || !profileImage) {
      toast.info("Please select or drop files to upload");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("profileImage", profileImage.file);
      files.forEach((file, index) => {
        formData.append(`sideImages`, file.file);
      });
      const response = await fetch("/api/pet-sitter/upload", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      toast.success("Images uploaded successfully.");
      setFiles([]);
      setProfileImage(null);
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFilesToState(droppedFiles);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row gap-3">
        {profileImage ? (
          <div className="relative w-[167px] h-[167px] flex">
            <Image
              src={profileImage.preview}
              alt="Profile Preview"
              width={167}
              height={167}
              className="object-cover w-full h-full"
            />
            <FaTimes className="absolute top-1 right-1 text-red cursor-pointer" />
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const droppedFiles = Array.from(e.dataTransfer.files);
              if (droppedFiles.length > 0) {
                addProfileImageToState(droppedFiles);
              }
            }}
            className={`border-2 ${
              isDragging ? "border-blue-500" : "border-gray-300"
            } p-3 text-center bg-white ${
              isDragging ? "bg-gray-100" : "bg-white"
            } cursor-pointer w-[167px] h-[167px] flex items-center justify-center`}
            onClick={() => {
              if (!profileImage) {
                document.getElementById("profileInput").click();
              }
            }}
          >
            <p className="text-gray-500">
              {profileImage
                ? "Profile image selected"
                : "click to select profile image"}
            </p>
          </div>
        )}
      </div>

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

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 ${
            isDragging ? "border-blue-500" : "border-gray-300"
          } p-3 text-center bg-white ${
            isDragging ? "bg-gray-100" : "bg-white"
          } cursor-pointer w-[167px] h-[167px] flex items-center justify-center`}
          onClick={() => {
            if (files.length < uploadLimit) {
              document.getElementById("fileInput").click();
            }
          }}
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

      {/* Hidden file inputs */}
      <input
        id="fileInput"
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={files.length >= uploadLimit}
      />
      <input
        id="profileInput"
        type="file"
        onChange={(e) => {
          const selectedFile = e.target.files[0];
          if (selectedFile) {
            setProfileImage({
              file: selectedFile,
              preview: URL.createObjectURL(selectedFile),
            });
          }
        }}
        className="hidden"
      />

      {/* Submit button */}
      <div>
        <button
          onClick={handleUpload}
          disabled={uploading || (!files.length && !profileImage)}
          className={`mt-5 px-4 py-2 rounded text-white ${
            uploading || (!files.length && !profileImage)
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

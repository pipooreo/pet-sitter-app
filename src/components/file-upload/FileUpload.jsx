"use client";
import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase.client";
import { toast } from "react-toastify";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileURL, setFileURL] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      setUploading(true);

      if (!file) {
        toast.info("Please select a file to upload");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;
      console.log("File path:", filePath);

      // Upload to Supabase
      let { error } = await supabase.storage
        .from("test")
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data } = supabase.storage.from("test").getPublicUrl(filePath);
      console.log("Public URL data:", data);

      if (!data.publicUrl) {
        throw new Error("Failed to get public URL");
      }

      // Set the file URL state
      setFileURL(data.publicUrl);
      toast.info("File uploaded successfully.");

      // Call your API to insert into the database
      const response = await fetch("/api/pet-sitter/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicUrl: data.publicUrl }), // Send the actual public URL
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      toast.success("Image URL saved to database.");
    } catch (error) {
      toast.error("Error uploading file: " + error.message);
      console.log(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {fileURL && (
        <div>
          <p>File uploaded to: {fileURL}</p>
          <Image src={fileURL} alt="Uploaded file" width={300} height={300} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;

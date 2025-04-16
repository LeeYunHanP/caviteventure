"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type EditableProfileProps = {
  initialName: string;
  initialEmail: string;
  initialCity: string;
  initialGender: "male" | "female";
  initialProfilePicture?: string;
  /** Text to display on the cancel button */
  cancelButtonText?: string;
};

export default function EditableProfile({
  initialName,
  initialEmail,
  initialCity,
  initialGender,
  initialProfilePicture,
  cancelButtonText = "Cancel",
}: EditableProfileProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [city, setCity] = useState(initialCity);
  const [gender, setGender] = useState<"male" | "female">(initialGender);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    initialProfilePicture
  );
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Simulate an image upload; in production, upload to S3/Cloudinary, etc.
  const handleFileUpload = async (file: File): Promise<string> => {
    setUploading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        setUploading(false);
        resolve(url);
      }, 2000);
    });
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Immediately show a preview
      const previewUrl = URL.createObjectURL(file);
      setProfilePicture(previewUrl);
      // Simulate the upload process
      const uploadedUrl = await handleFileUpload(file);
      setProfilePicture(uploadedUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city, gender, profilePicture }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Profile updated successfully.");
        setTimeout(() => router.push("/profilepage"), 1500);
      } else {
        setStatus(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setStatus("An error occurred while updating your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(initialName);
    setCity(initialCity);
    setGender(initialGender);
    setProfilePicture(initialProfilePicture);
    setStatus("");
  };

  return (
    <form
      onSubmit={handleSave}
      className="bg-white shadow rounded-lg p-6 relative overflow-hidden"
    >
      {/* Decorative building silhouette at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-8 overflow-hidden opacity-10 pointer-events-none">
        <div
          className="w-full h-full bg-repeat-x"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg ...%3E")`,
            backgroundSize: "1000px 40px",
          }}
        ></div>
      </div>

      {/* Profile picture & upload */}
      <div className="flex flex-col items-center mb-6 relative z-10">
        <div className="relative">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt="Profile"
              width={128}
              height={128}
              className="rounded-full object-cover border-4 border-[#8B4513]"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-[#e6d7c3] flex items-center justify-center text-[#654321]">
              No Image
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-[#8B4513] text-[#f5f0e5] rounded-full p-2 cursor-pointer hover:bg-[#654321] transition shadow-md">
            {uploading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8..."
                  clipRule="evenodd"
                />
              </svg>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
        <div>
          <label className="block text-xl font-semibold text-[#654321]">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 p-3 border border-[#e6d7c3] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-xl font-semibold text-[#654321]">
            Email
          </label>
          <input
            type="email"
            value={initialEmail}
            readOnly
            className="mt-2 p-3 border border-[#e6d7c3] rounded w-full bg-[#f5f0e5] cursor-not-allowed text-[#8B4513]"
          />
        </div>
        <div>
          <label className="block text-xl font-semibold text-[#654321]">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-2 p-3 border border-[#e6d7c3] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-xl font-semibold text-[#654321]">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) =>
              setGender(e.target.value as "male" | "female")
            }
            className="mt-2 p-3 border border-[#e6d7c3] rounded w-full focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent bg-white"
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {/* Status message */}
      {status && (
        <div className="mt-4 p-3 bg-[#f5f0e5] border border-[#e6d7c3] rounded text-[#654321] font-semibold">
          {status}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-4 mt-6 relative z-10">
        <button
          type="submit"
          disabled={isSaving}
          className={`flex-1 p-3 rounded text-white font-medium transition ${
            isSaving
              ? "bg-[#a67c52] cursor-not-allowed"
              : "bg-[#8B4513] hover:bg-[#654321]"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 p-3 rounded border border-[#e6d7c3] text-[#654321] hover:bg-[#f5f0e5] transition"
        >
          {cancelButtonText}
        </button>
      </div>
    </form>
  );
}

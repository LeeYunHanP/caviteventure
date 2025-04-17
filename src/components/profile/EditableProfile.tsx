"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  initialName: string;
  initialEmail: string;
  initialCity: string;
  initialGender: "male" | "female";
  initialProfilePicture?: string;
  cancelButtonText?: string;
};

export default function EditableProfile({
  initialName,
  initialEmail,
  initialCity,
  initialGender,
  initialProfilePicture,
  cancelButtonText = "Cancel",
}: Props) {
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

  // Upload to your per-user folder
  const handleFileUpload = async (file: File): Promise<string> => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/auth/uploadProfileImage", {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      setUploading(false);
      throw new Error("Upload failed");
    }
    const { url } = await res.json();
    setUploading(false);
    return url;
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setProfilePicture(URL.createObjectURL(file));
    try {
      const uploadedUrl = await handleFileUpload(file);
      setProfilePicture(uploadedUrl);
    } catch {
      setStatus("Image upload failed");
    }
  };

  const onSave = async (e: React.FormEvent) => {
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
      if (!res.ok) {
        setStatus(data.message || "Update failed");
      } else {
        setStatus("Saved!");
        setTimeout(() => router.push("/profilepage"), 1200);
      }
    } catch {
      setStatus("Server error");
    } finally {
      setIsSaving(false);
    }
  };

  const onCancel = () => {
    setName(initialName);
    setCity(initialCity);
    setGender(initialGender);
    setProfilePicture(initialProfilePicture);
    setStatus("");
  };

  return (
    <form onSubmit={onSave} className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col items-center mb-6">
        {profilePicture ? (
          <Image
            src={profilePicture}
            alt="Profile"
            width={128}
            height={128}
            className="rounded-full object-cover border-4 border-[#8B4513]"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
            No Image
          </div>
        )}
        <label className="mt-2 inline-flex items-center px-3 py-1 bg-[#8B4513] text-white rounded cursor-pointer">
          {uploading ? "Uploading…" : "Change"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onFileChange}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            value={initialEmail}
            readOnly
            className="mt-1 w-full p-2 border bg-gray-100 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">City</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Gender</label>
          <select
            value={gender}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setGender(e.target.value as "male" | "female")
            }
            className="mt-1 w-full p-2 border rounded"
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {status && <p className="mt-4 text-sm text-red-600">{status}</p>}

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 px-4 py-2 bg-[#8B4513] text-white rounded disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border rounded"
        >
          {cancelButtonText}
        </button>
      </div>
    </form>
  );
}

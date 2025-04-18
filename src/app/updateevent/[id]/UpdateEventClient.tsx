"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import {
  Calendar,
  MapPin,
  Image as LucideImage,
  Upload,
  X,
  Loader2,
  Save,
  ArrowLeft,
} from "lucide-react";

export default function UpdateEventClient({
  eventData,
}: {
  eventData: string;
}) {
  const router = useRouter();
  // Parse the event data from props
  const parsedEvent = JSON.parse(eventData);

  const [title, setTitle] = useState(parsedEvent.title);
  const [description, setDescription] = useState(parsedEvent.description);
  const [date, setDate] = useState(parsedEvent.date?.split("T")[0]); // "2025-03-28T00:00:00Z" → "2025-03-28"
  const [location, setLocation] = useState(parsedEvent.location);
  const [image, setImage] = useState<string>(parsedEvent.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Convert file to base64 if we want to allow updating the image
  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  }

  // Trigger the hidden file input
  const handleChooseImageClick = () => {
    document.getElementById("eventImageInput")?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setImage(base64);
    } catch (err) {
      console.error("Failed to convert file:", err);
      setError("Failed to upload image");
    }
  };

  const handleRemoveImage = () => {
    setImage("");
    const fileInput = document.getElementById(
      "eventImageInput"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/events/${parsedEvent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, location, image }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update event");
        return;
      }

      setSuccess("Event updated successfully!");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      console.error("Error updating event:", err);
      setError("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#e6dfd3]">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#5d4037]">
              Update Event
            </h1>
            <button
              onClick={handleCancel}
              className="p-2 rounded-full bg-[#f8f5f0] text-[#8d6e63] hover:bg-[#e6dfd3] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          <p className="text-[#8d6e63] mb-6">Edit the event details below</p>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[#5d4037]"
            >
              Event Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-3 py-3 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent bg-[#faf6f0] transition-all duration-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[#5d4037]"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-3 py-3 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent bg-[#faf6f0] transition-all duration-200"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your event"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Date */}
            <div className="space-y-2">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-[#5d4037]"
              >
                Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-[#a1887f]" />
                </div>
                <input
                  type="date"
                  id="date"
                  className="w-full pl-10 pr-3 py-3 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent bg-[#faf6f0] transition-all duration-200"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-[#5d4037]"
              >
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-[#a1887f]" />
                </div>
                <input
                  type="text"
                  id="location"
                  className="w-full pl-10 pr-3 py-3 border border-[#e6dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8d6e63] focus:border-transparent bg-[#faf6f0] transition-all duration-200"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Event location"
                  required
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#5d4037]">
              Event Image
            </label>

            <div className="mt-1 flex items-center gap-4">
              <button
                type="button"
                onClick={handleChooseImageClick}
                className="px-4 py-2.5 bg-[#f8f5f0] hover:bg-[#e6dfd3] text-[#5d4037] font-medium rounded-lg transition-colors duration-200 inline-flex items-center gap-2 border border-[#e6dfd3]"
              >
                <LucideImage size={18} />
                {image ? "Change Image" : "Choose Image"}
              </button>

              {/* Hidden file input */}
              <input
                type="file"
                id="eventImageInput"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {image && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 inline-flex items-center gap-1.5 border border-red-200"
                >
                  <X size={16} />
                  Remove
                </button>
              )}
            </div>

            {/* Show preview if an image is selected */}
            {image && (
              <div className="mt-4">
                <div className="bg-[#f8f5f0] p-2 rounded-lg border border-[#e6dfd3]">
                  <p className="text-xs text-[#8d6e63] mb-2 flex items-center">
                    <Upload size={14} className="mr-1" />
                    Image Preview
                  </p>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-white">
                    <NextImage
                      src={image || "/placeholder.svg"}
                      alt="Event preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="py-3 px-4 bg-[#f8f5f0] hover:bg-[#e6dfd3] text-[#5d4037] font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-[#e6dfd3]"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-4 bg-[#8d6e63] hover:bg-[#5d4037] text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#8d6e63] disabled:hover:shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

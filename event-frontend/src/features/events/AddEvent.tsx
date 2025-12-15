// src/pages/AddEvent.tsx
import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CREATE_EVENT, GET_SIGNATURE } from "../../queries/queries";
import { eventFormSchema } from "../../validation/eventFormSchema";
import type { EventFormSchema } from "../../validation/eventFormSchema";

import ImageUpload from "../../components/ImageUpload";
import EventLocationPicker from "./EventLocationPicker";
import type { LocationData } from "./EventLocationPicker";

interface CloudinaryUploadResult {
  secure_url: string;
}

type GetSignatureResponse = {
  getCloudinarySignature: {
    apiKey: string;
    cloudName: string;
    signature: string;
    timestamp: number;
  };
};

type GetSignatureVars = Record<string, never>;


const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dqm9cv8nj/image/upload/v1764240724/780-7801295_celebration-download-png-celebration-background_iezywq.jpg";

export default function AddEvent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(eventFormSchema),
    mode: "onBlur",
  });

  const [getSignature] = useMutation<GetSignatureResponse, GetSignatureVars>(GET_SIGNATURE);
  const [createEvent] = useMutation(CREATE_EVENT);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const { data } = await getSignature();
    if (!data?.getCloudinarySignature) throw new Error("Missing signature");

    const sig = data.getCloudinarySignature;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", sig.timestamp.toString());
    formData.append("signature", sig.signature);
    formData.append("folder", "events");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    const json = (await res.json()) as CloudinaryUploadResult;
    return json.secure_url;
  };

  const onSubmit = async (data: EventFormSchema) => {
    setMsg(null);
    setErr(null);

    try {
      let imageUrl = DEFAULT_IMAGE;
      if (selectedFile) imageUrl = await uploadToCloudinary(selectedFile);

      const isoTime = new Date(data.time).toISOString();

      const result = await createEvent({
        variables: {
          name: data.name,
          description: data.description,
          time: isoTime,
          image: imageUrl,
          latitude: location?.lat,
          longitude: location?.lng,
          address: location?.address,
        },
      });

      setMsg(`Event "${result.data.createEvent.name}" created!`);
      reset();
      setSelectedFile(null);
      setLocation(null);
    } catch (e) {
      console.error(e);
      setErr("Failed to create event.");
    }
  };

  useEffect(() => {
    if (msg || err) {
      const t = setTimeout(() => {
        setMsg(null);
        setErr(null);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [msg, err]);

  return (
    <div className="mt-24 flex justify-center">
      <div className="w-full max-w-xl p-2 rounded bg-red-200">
        <h1 className="text-2xl">Add event</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-medium">Name</label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="bg-red-100 w-full"
              placeholder="Event name"
            />
            {errors.name && <p>{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="mt-2">
            <label htmlFor="description" className="block font-medium">Description</label>
            <textarea
              id="description"
              {...register("description")}
              className="bg-red-100 w-full"
              placeholder="Event description"
            />
            {errors.description && <p>{errors.description.message}</p>}
          </div>

          {/* Time */}
          <div className="mt-2">
            <label htmlFor="date" className="block font-medium">Date</label>
            <input
              id="date"
              type="datetime-local"
              {...register("time")}
              className="bg-red-100"
            />
            {errors.time && <p>{errors.time.message}</p>}
          </div>

          {/* Image Upload */}
          <ImageUpload onSelectFile={setSelectedFile} />

          {/* Location Picker */}
          <EventLocationPicker onChange={setLocation} />

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-400 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </form>

        {msg && <p role="alert">{msg}</p>}
        {err && <p role="alert">{err}</p>}
      </div>
    </div>
  );
}
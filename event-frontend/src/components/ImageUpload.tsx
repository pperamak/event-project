// src/components/forms/ImageUpload.tsx
import { useState } from "react";

interface Props {
  onSelectFile: (file: File | null) => void;
}

const MAX_FILE_SIZE = 6 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export default function ImageUpload({ onSelectFile }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setPreviewUrl(null);
    setFileError(null);
    onSelectFile(file);

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError("Only PNG, JPG, JPEG, or WEBP images are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("Image must be smaller than 6MB.");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="mt-2">
      <label className="block font-medium">Image</label>
      <input type="file" accept="image/*" className="bg-red-100" onChange={handleChange} />

      {fileError && <p className="text-red-600">{fileError}</p>}

      {previewUrl && (
        <img src={previewUrl} alt="Preview" className="mt-2 max-h-48 rounded shadow" />
      )}
    </div>
  );
}
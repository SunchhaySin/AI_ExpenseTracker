import { convertToBase64 } from './useFileUpload';
import { useState } from 'react';
import { API_BASE_URL } from '../context';
import { getAuthHeader } from '../utils/token';

export default function UseSaveProfileImage() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const SaveProfileImage = async (imageFile) => {
    setIsLoading(true);
    try {
      const base64File = await convertToBase64(imageFile);
      if (!base64File) {
        console.error("Invalid File Data.");
        return null;
      }

      const res = await fetch(`${API_BASE_URL}/profile/picture/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ image: base64File }),
      });
       const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save profile image.");
      }

      setSuccess(data.message || "Profile image saved successfully.");

    } catch (err) { 
      console.error("Error saving profile image:", err.message);
      setError(err.message || "Server Error");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    SaveProfileImage,
    error,
    setError,
    isLoading,
    success,
    setSuccess,
  }
}

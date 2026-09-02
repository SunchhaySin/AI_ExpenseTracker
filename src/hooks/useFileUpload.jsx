import { useRef, useState, useCallback } from "react";
import UseAppContext, { API_BASE_URL } from "../context";
import { getAuthHeader } from "../utils/token";

export function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
  });
}

export default function UseFileUpload() {
  const { loggedInUser, setUploadSlips, setAllPaymentSlips } = UseAppContext();

  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [rawFiles, setRawFiles] = useState([]); // Saves the Raw File Object directly from the fileInput upload

  const buildUploadItem = useCallback(async (file) => {
    try {
      const base64File = await convertToBase64(file);

      if (!base64File) {
        console.error("No file data to upload.");
        return null;
      }

      const result = await fetch(`${API_BASE_URL}/api/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ images: base64File }),
      });

      const data = await result.json();

      if (!result.ok) {
        console.error("Failed to extract detail from the uploaded image.");
        return null;
      }
      if (!data.data) {
        console.error("Unstable AI Processing.");
        return null;
      }

      return {
        name: data.data.name,
        amount: data.data.amount,
        currency: data.data.currency,
        date: data.data.date,
        time: data.data.time,
        senderName: data.data.senderName,
        paymentMethod: data.data.paymentMethod,
        items: data.data.items,
        image: base64File,
        mimeType: file.type,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  const handleFileUpload = useCallback(
    async (e) => {
      const files = Array.from(e.target.files);
      setRawFiles(files);
      console.log("Uploading New: ", files);
      if (files.length === 0) return;

      setIsLoading(true);
      try {
        // Scan every file in parallel; each either returns an item or null
        const scannedItems = await Promise.all(files.map(buildUploadItem));
        const validItems = scannedItems.filter(Boolean);

        if (validItems.length === 0) {
          alert("No files could be processed.");
          return;
        }

        if (validItems.length < files.length) {
          alert(
            `${files.length - validItems.length} file(s) failed to process and were skipped.`,
          );
        }

        if (loggedInUser) {
          const normalizedItems = validItems.map((item) => ({
            ...item,
            image: { image: item.image, mimeType: item.mimeType }, // match backend's { image, mimeType } shape
          }));
          setAllPaymentSlips((prev) => [...prev, ...normalizedItems]);

          const res = await fetch(`${API_BASE_URL}/save/uploads`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
            credentials: "include",
            body: JSON.stringify({ uploadItems: validItems }), // array — batched
          });

          if (!res.ok) {
            const err = await res.json();
            console.error(err.error);
            alert("Failed to save some uploads.");
          }
          const data = await res.json();
          console.log({
            message: data.message,
            data: data.data,
          });
          alert(data.message);
        } else {
          const normalizedItems = validItems.map((item) => ({
            ...item,
            image: { image: item.image, mimeType: item.mimeType },
          }));
          setUploadSlips((prev) => [...prev, ...normalizedItems]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loggedInUser, setAllPaymentSlips, setUploadSlips, buildUploadItem],
  );

  return {
    fileInputRef,
    isLoading,
    rawFiles,
    handleFileUpload,
    convertToBase64,
  };
}

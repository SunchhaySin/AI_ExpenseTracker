import React, { useState, useCallback } from 'react'
import UseAppContext, { API_BASE_URL } from '../context';
import { getAuthHeader } from '../utils/token';

export default function UseRenameUpload() {
  const [renamingId, setRenamingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { 
    loggedInUser,
    allPaymentSlips,
    setAllPaymentSlips,
    uploadedSlips,
    setUploadSlips,
  } = UseAppContext();

  const renameUpload = useCallback(async (index, uploadedFile = null, fileName) => {
    if (!fileName || typeof fileName !== "string" || fileName.trim().length === 0) return;
    const uploaded = uploadedFile ?? allPaymentSlips[index]
    const id = uploaded?.id
    setRenamingId(id);
    setIsLoading(true);

    try {
      if (loggedInUser) {
        const response = await fetch(`${API_BASE_URL}/rename/upload/${id}`, {
          method: "PATCH",
          headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({ fileName }),
        })

        if (!response.ok) {
          const error = await response.json();
          alert(error.message)
          console.error(error.error)
          return;
        }

        const data = await response.json();
        console.log(data)
        setAllPaymentSlips((prev) =>
          prev.map((slip) =>
            slip.id === id
              ? { ...slip, name: fileName }
              : slip
          )
        )
      } else {
        setUploadSlips((prev) =>
          prev.map((slip) =>
            slip.id === id
              ? { ...slip, name: fileName }
              : slip
          )
        )
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [loggedInUser, allPaymentSlips, setAllPaymentSlips, uploadedSlips, setUploadSlips]) 
  
  return {
    renameUpload,
    isLoading,
  }
}

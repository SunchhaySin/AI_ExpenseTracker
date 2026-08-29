import React, {useState, useCallback} from 'react'
import UseAppContext from "../context";

export default function UseFileDelete() {
    const {
        loggedInUser, 
        allPaymentSlips, 
        setAllPaymentSlips, 
        uploadedSlips,
        setUploadSlips,
    } = UseAppContext();

    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null); // stores the upload id thats being deleted

    const DeleteUpload = useCallback(async (index, file = null) => {
        setIsLoading(true);
        const uploaded_file = file ?? (loggedInUser ? allPaymentSlips[index] : uploadedSlips[index]);

        const displayName = uploaded_file?.name || uploaded_file?.merchantName || uploaded_file?.paidTo || "this file";
        const confirmDelete = confirm(`Do you want to delete this upload: ${displayName} ?`)
        if(!confirmDelete) return;
        setDeletingId(uploaded_file.id)
        try {
            if(loggedInUser) {
                const response = await fetch(`https://expensetrackerserver-agte.onrender.com/delete/upload/${uploaded_file.id}`, {
                    method: "DELETE",
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                })
                if(!response.ok) {
                    const error = await response.json()
                    console.error(error.error)
                    alert("Failed to delete this file");
                    setDeletingId(null);
                    return;
                }
                const data = await response.json();
                if(!data.data) {
                    alert("Delete Failed");
                    setDeletingId(null);
                    return;
                }
                alert("Successfully Deleted File");
                setAllPaymentSlips(allPaymentSlips.filter((upload) => upload.id !== uploaded_file.id))
            } else {
                setUploadSlips(uploadedSlips.filter((upload) => upload.id !== uploaded_file.id))
            }

        } catch(err) {
            console.error(err.message)
        } finally {
            setIsLoading(false);
            setDeletingId(null);
        }
    }, [loggedInUser, allPaymentSlips, setAllPaymentSlips, uploadedSlips, setUploadSlips ])

  return {
    deletingId,
    isLoading,
    DeleteUpload,
  }
}

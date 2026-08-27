import { useRef, useState, useEffect, useCallback } from 'react'
import UseAppContext from '../src/context';

export default function UseFileUpload() {
    const {
        loggedInUser,
        uploadedSlips,       // If user not logged in, uploadedSlips disappears on refresh
        setUploadSlips,
        allPaymentSlips,     // Tracks all uploaded files, for logged in users
        setAllPaymentSlips,
    } = UseAppContext();

    const [imageText, setImageText] = useState([]);
    // const [imagePreview, setImagePreview] = useState("");
    const fileInputRef = useRef(null);
    const [onDetail, setOnDetail] = useState(false);
    const [detail, setDetail] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     return () => {
    //         if (imagePreview) {
    //             URL.revokeObjectURL(imagePreview);
    //         }
    //     };
    // }, [imagePreview]);

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    }

    const handleFile = useCallback(async (index, fileOverride = null) => {
        setImageText([]);
        setIsLoading(true);
        try {
            const file = fileOverride ?? (loggedInUser ? allPaymentSlips[index] : uploadedSlips[index]);
            const base64File = await convertToBase64(file);

            if (!base64File) {
                alert("No Files Uploaded.");
                return;
            }

            const result = await fetch('https://expensetrackerserver-agte.onrender.com/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ images: base64File })
            });

            const data = await result.json();
            if (!result.ok) {
                alert("Failed to extract detail from the uploaded image.");
                return;
            }
            if (!data.data) {
                alert("Unstable AI Processing.");
                return;
            }
            setImageText(data.data);

            const uploadItem = {
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

            if (loggedInUser) {
                setAllPaymentSlips((prev) => [...prev, uploadItem]);

                const res = await fetch('http://localhost:3000/save/uploads', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        data: [uploadItem],
                        userID: loggedInUser.userID,
                    })
                });

                if (!res.ok) {
                    const err = await res.json();
                    console.error(err.error);
                }
            } else {
                setUploadSlips((prev) => [...prev, uploadItem]);
            }
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [uploadedSlips, allPaymentSlips, loggedInUser, setAllPaymentSlips, setUploadSlips]);

    const handleFileUpload = useCallback((e) => {
        const files = Array.from(e.target.files);
        files.forEach((file, i) => handleFile(i, file));
    }, [handleFile]);

    // const deleteUpload = useCallback(async (index) => {
    //     const confirmDelete = confirm("Are you sure you want to delete this record?");
    //     if (!confirmDelete) return;

    //     if (!loggedInUser) {
    //         setUploadSlips((prevSlips) => prevSlips.filter((_, slipIndex) => slipIndex !== index));
    //         return;
    //     }
    //     try {
    //         const file = allPaymentSlips[index];
    //         const url = file.type === "transaction"
    //             ? `https://expensetrackerserver-agte.onrender.com/delete/invoice/${loggedInUser.userID}/${file.uploadID}`
    //             : `https://expensetrackerserver-agte.onrender.com/delete/receipt/${loggedInUser.userID}/${file.receiptID}`;

    //         const result = await fetch(url, { method: 'DELETE', credentials: 'include' });
    //         if (!result.ok) {
    //             alert("Could not delete this upload");
    //             return;
    //         }
    //         setAllPaymentSlips((prevSlips) => prevSlips.filter((_, slipIndex) => slipIndex !== index));
    //     } catch (err) {
    //         console.error(err.message);
    //     }
    // }, [loggedInUser, allPaymentSlips, setAllPaymentSlips, setUploadSlips]);

    // const previewImg = useCallback((index) => {
    //     const file = loggedInUser ? allPaymentSlips[index] : uploadedSlips[index];
    //     if (!file) return;
    //     if (!file.type.startsWith("image/")) {
    //         alert("This file is not an image");
    //         return;
    //     }
    //     setImagePreview(URL.createObjectURL(file));
    // }, [loggedInUser, allPaymentSlips, uploadedSlips]);

    // const viewDetail = useCallback((index) => {
    //     const source = loggedInUser ? allPaymentSlips : uploadedSlips;
    //     setOnDetail(true);
    //     setDetail(source[index] ?? {});
    // }, [loggedInUser, allPaymentSlips, uploadedSlips]);

    // const closeDetail = useCallback(() => {
    //     setOnDetail(false);
    //     setDetail({});
    // }, []);

    return {
        // state
        // fileExist,
        // imageText,
        // imagePreview,
        fileInputRef,
        onDetail,
        detail,
        isLoading,
        // handlers
        handleFileUpload,
        handleFile,
        // deleteUpload,
        // previewImg,
        // viewDetail,
        // closeDetail,
        convertToBase64,
    };
}
import { useRef, useState, useCallback } from 'react'
import UseAppContext from '../context';

export default function UseFileUpload() {
    const {
        loggedInUser,
        setUploadSlips,
        setAllPaymentSlips,
    } = UseAppContext();

    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);


    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    }

    const buildUploadItem = useCallback(async (file) => {
        try {
            const base64File = await convertToBase64(file);

            if (!base64File) {
                console.error("No file data to upload.");
                return null;
            }

            const result = await fetch('https://expensetrackerserver-agte.onrender.com/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ images: base64File })
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

    const handleFileUpload = useCallback(async (e) => {
        const files = Array.from(e.target.files);
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
                alert(`${files.length - validItems.length} file(s) failed to process and were skipped.`);
            }

            if (loggedInUser) {
                setAllPaymentSlips((prev) => [...prev, ...validItems]);

                const res = await fetch('https://expensetrackerserver-agte.onrender.com/save/uploads', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ uploadItems: validItems }), // array — batched
                });

                if (!res.ok) {
                    const err = await res.json();
                    console.error(err.error);
                    alert("Failed to save some uploads.");
                }
                const data = await res.json()
                alert(data.message)
                console.log({
                    message: data.message,
                    data: data.data
                })
            } else {
                setUploadSlips((prev) => [...prev, ...validItems]);
            }
        } finally {
            setIsLoading(false);
        }
    }, [loggedInUser, setAllPaymentSlips, setUploadSlips, buildUploadItem]);

    

    return {
        fileInputRef,
        isLoading,

        handleFileUpload,
        convertToBase64,
    };
}
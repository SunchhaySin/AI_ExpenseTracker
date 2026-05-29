import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Sidebar({ loggedInUser, onLoginClick, onSignupClick, onLogoutClick }) {
    const onLogin = () => {
        onLoginClick()
    }

    const onSignup = () => {
        onSignupClick()
    }

    const onLogout = () => {
        onLogoutClick();
    }
    const goToProfile = () => {
        navigate('/profile')
    }

    const navigate = useNavigate()
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileExist, setFileExist] = useState(false)
    const [imageText, setImageText] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        const updatedFiles = [...uploadedFiles, ...files];
        setUploadedFiles(updatedFiles);
        console.log("Files", updatedFiles)
        setFileExist(true)
    };

    const triggerFileDialog = () => {
        fileInputRef.current.click();
    };

    const removeFile = (index) => {
        const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(updatedFiles);
        console.log(updatedFiles)
        if (updatedFiles.length === 0) {
            setFileExist(false);
        }
    };

    const previewImg = (index) => {
        const file = uploadedFiles[index];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("This file is not an image");
            return;
        }
        const img_url = URL.createObjectURL(file)
        setImagePreview(img_url)

    }

    async function handleFile(index) {
        setImageText([]);
        try {
            const base64File = await convertToBase64(uploadedFiles[index]);

            if (!base64File) {
                alert("No Files Uploaded.");
                return;
            }

            const result = await fetch('http://localhost:3000/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: base64File })
            });

            const data = await result.json();
            console.log(data);
            if (!data.data) {  
                alert("Unstable AI Processing.");
                return;
            }
            setImageText(data.data)
            console.log(imageText)

            if(loggedInUser.userID) {
                if (data.data.type == "transaction") {
                    const uploadResult = await fetch('http://localhost:3000/upload/invoice', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        { data: 
                            {
                                ...data.data,
                                userID: loggedInUser.userID
                            }
                        })
                    })

                    if (!uploadResult.ok) { 
                        const err = await uploadResult.json();
                        console.error(err.error);
                    }
                    console.log("Uploaded Invoice", uploadResult)

                } else if (data.data.type == "receipt") {
                    const uploadResult = await fetch('http://localhost:3000/upload/receipt', {
                        method: "POST",
                        headers: { 'Content-Type' : 'application/json'},
                        body: JSON.stringify({...data.data, userID: loggedInUser.userID})
                    })
                    const response = await uploadResult.json();
                    console.log("Receipt response:", response);
                    if(!uploadResult.ok) {
                        console.error(response.error);
                    }
                    console.log("Uploaded Receipt", uploadResult)
                }
            }

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    }

    return (
        <div className="flex flex-col bg-(--code-bg) p-4">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border border-(--border) bg-(--bg2) content-center justify-items-center">
                    <img src="src/assets/noProfile.png" className="h-10" onClick={goToProfile} />
                </div>
                <div className="flex justify-between flex-1 border border-(--border) bg-(--bg) rounded-full p-1">
                    <p className="text-(--text-orange) text-l p-2">
                        {loggedInUser.username ? `${loggedInUser.username}` : "Not Logged In"}
                    </p>
                    {!loggedInUser.username && (
                        <button className="bg-(--bg2) text-(--text-l) rounded-full p-2 hover:bg-(--text-orange)" onClick={onLogin}>
                            Login
                        </button>
                    )}

                    {loggedInUser.username && (
                        <button className="bg-(--bg2) text-(--text-l) rounded-full p-2 hover:bg-(--text-orange)" onClick={onLogout}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
            <div className="flex flex-col  mt-8">
                <p className="text-(--text)">Upload Invoice Receipts</p>
                <input type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept=".jpg,.png,.pdf"
                    multiple
                />
                <button className="flex justify-center items-center gap-3 mt-3 text-(--text-d) text-lg bg-(--bg2) border border-(--border) p-2 rounded-lg hover:bg-(--text-orange)"
                    onClick={triggerFileDialog}>
                    <p>Upload</p>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg>
                </button>
                {/* <Text>{result.senderName}</Text>
                <Text>{result.amount}</Text>
                <Text>{result.merchantName}</Text> */}
                {fileExist && <p className="text-(--text) mt-5">Uploaded Files</p>}
                <ul className="mt-2 overflow-y-auto max-h-[200px]">
                    {uploadedFiles.map((file, index) => (
                        <li key={index}
                            onClick={() => handleFile(index)}
                            className="flex justify-between items-center bg-(--bg) p-2 rounded mt-2 cursor-pointer">
                            <span className="text-[var(--text)]">{file.name}</span>
                            <div className="flex gap-2">
                                <span onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index)
                                }}
                                    className="cursor-pointer">

                                    <svg className="fill-[#E3E3E3] hover:fill-red-500 transition-colors"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px" viewBox="0 -960 960 960"
                                        width="24px" fill="#E3E3E3">
                                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                    </svg>
                                </span>
                                <span onClick={(e) => {
                                    e.stopPropagation();
                                    previewImg(index)
                                }}
                                    className="cursor-pointer">
                                    <svg className="fill-[#E3E3E3] hover:fill-blue-500 transition-colors"
                                        xmlns="http://www.w3.org/2000/svg" 
                                        height="24px" viewBox="0 -960 960 960" 
                                        width="24px" fill="#E3E3E3">
                                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
                                    </svg>
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
                {imagePreview && (
                    <img
                        src={imagePreview}
                        height={250}
                        alt={"Selected Preview"}
                        className="mt-4 max-h-[300px] rounded object-contain"
                    />
                )}
            </div>
            <button className="flex justify-center mt-auto bg-(--bg2) p-2 rounded-lg text-lg hover:bg-(--text-orange)" onClick={onSignup}>
                Register
            </button>
        </div>
    )
}

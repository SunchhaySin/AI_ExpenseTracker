import React from 'react'
import { useRef, useState, useEffect } from 'react'

export default function Sidebar({ onLoginClick, onSignupClick }) {

    const onLogin = () => {
        onLoginClick()
    }

    const onSignup = () => {
        onSignupClick()
    }

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileExist, setFileExist] = useState(false)
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        setSelectedFiles([...selectedFiles, ...files]);
        setFileExist(true)
    };

    const triggerFileDialog = () => {
        fileInputRef.current.click();
    };

    const removeFile = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };
    
    return (
        <div className="flex flex-col bg-(--code-bg) p-4">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border border-(--border) bg-(--bg2) content-center justify-items-center">
                    <img src="src/assets/noProfile.png" className="h-10" />
                </div>
                <div className="flex justify-between flex-1 border border-(--border) bg-(--bg) rounded-full p-1">
                    <p className="text-(--text-orange) text-l p-2">Not Logged In</p>
                    <button className="bg-(--bg2) text-(--text-l) rounded-full p-2 hover:bg-(--text-orange)" onClick={onLogin}>Login</button>
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
                {fileExist && <p className="text-(--text) mt-10">Uploaded Files</p>}
                <ul className="mt-2">
                    {selectedFiles.map((file, index) => (
                        <li key={index} className="flex justify-between items-center bg-(--bg) p-2 rounded mt-2 ">
                            <span className="text-[var(--text)]">{file.name}</span>
                            <span onClick={() => removeFile(index)}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#E3E3E3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <button className="flex justify-center mt-auto bg-(--bg2) p-2 rounded-lg text-lg hover:bg-(--text-orange)" onClick={onSignup}>
                Register
            </button>
        </div>
    )
}

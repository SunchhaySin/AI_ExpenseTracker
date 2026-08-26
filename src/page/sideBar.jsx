import React from 'react'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import UseAppContext from '../context'

// export default function Sidebar({ loggedInUser, onLoginClick, onSignupClick, onLogoutClick, onUploadResult, getAllPayments, onClose }) {
export default function Sidebar() {
    const {
        windowWidth,
        loggedInUser,
        uploadedSlips, // If user not logged In, uploadedFile will disappear on refresh
        setUploadSlips,
        allPaymentSlips, // Tracks all uploaded files, for logged in users
        setAllPaymentSlips,
    } = UseAppContext();

    const navigate = useNavigate()
    const [fileExist, setFileExist] = useState(false)
    const [imageText, setImageText] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const fileInputRef = useRef(null);
    const [onDetail, setOnDetail] = useState(false);
    const [detail, setDetail] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    useEffect(() => {
        if (loggedInUser) {
            if (allPaymentSlips?.length > 0) {
                setFileExist(true);
            }
        } else {
            if (uploadedSlips.length > 0) {
                setFileExist(true);
            }
        }
    }, [uploadedSlips.length, allPaymentSlips.length, loggedInUser])

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files)
        // const updatedFiles = loggedInUser ? [...allPaymentSlips, ...files] : [...uploadedSlips, ...files];
        // console.log("Files", updatedFiles)

        setFileExist(true)
        // if (loggedInUser) {
        //     setAllPaymentSlips(updatedFiles);
        // } else {
        //     setUploadSlips(updatedFiles);
        // }
        // files.map((file, idx) => handleFile(idx + 1, file))
        files.forEach((file, i) => handleFile(i, file));
    };

    async function deleteUpload(index) {
        const confirmDelete = confirm("Are you sure you want to delete this record?")
        if (!confirmDelete) return;
        if (!loggedInUser) {
            setUploadSlips((prevSlips) => prevSlips.filter((_, slipIndex) => slipIndex !== index));
            return;
        }
        try {
            const file = allPaymentSlips[index];
            const url = file.type === "transaction"
                ? `https://expensetrackerserver-agte.onrender.com/delete/invoice/${loggedInUser.userID}/${file.uploadID}`
                : `https://expensetrackerserver-agte.onrender.com/delete/receipt/${loggedInUser.userID}/${file.receiptID}`;

            const result = await fetch(url, { method: 'DELETE', credentials: 'include' });
            if (!result.ok) {
                alert("Could not delete this upload");
                return;
            }
            setAllPaymentSlips((prevSlips) => prevSlips.filter((_, slipIndex) => slipIndex !== index));
        } catch (err) {
            console.error(err.message);
        }
    };

    const previewImg = (index) => {
        const file = loggedInUser ? allPaymentSlips[index] : uploadedSlips[index];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("This file is not an image");
            return;
        }
        const img_url = URL.createObjectURL(file)
        setImagePreview(img_url)
    }

    const viewDetail = (index) => {
        setOnDetail(true);
        setDetail(allUploads[index])
    }

    const closeDetail = () => {
        setOnDetail(false);
        setDetail({})
    }

    const handleFile = useCallback(async (index, fileOverride = null) => {
        setImageText([]);
        setIsLoading(true)
        try {
            const file = fileOverride ?? (loggedInUser ? allPaymentSlips[index] : uploadedSlips[index]);
            const base64File = await convertToBase64(file);

            if (!base64File) {
                alert("No Files Uploaded.");
                return;
            }

            const result = await fetch('http://localhost:3000/api/scan', {
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
            console.log("scandata", data.data);
            if (!data.data) {
                alert("Unstable AI Processing.");
                return;
            }
            setImageText(data.data)
            setIsLoading(false);
            console.log("imageText", imageText)

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
                setAllPaymentSlips((prev) => [...prev, uploadItem])

                const res = await fetch('http://localhost:3000/save/uploads', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        data: [uploadItem],
                        userID: loggedInUser.userID,
                    })
                })

                if (!res.ok) {
                    const err = await res.json();
                    console.error(err.error);
                } else {
                    const response = await res.json();
                    console.log("Saved Upload", response);
                }
            } else {
                setUploadSlips((prev) => [...prev, uploadItem])
            }


        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }, [uploadedSlips, allPaymentSlips, loggedInUser])

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
      <div
        className={`${windowWidth > 750 ? "w-full flex flex-col bg-(--code-bg) p-4 rounded-3xl" : "flex gap-4 items-start w-full"} `}
      >
        <div
          className={`w-full bg-(--bg) border border-(--border)/60 rounded-2xl flex items-center justify-center
                ${windowWidth > 1000 ? " h-1/3" : windowWidth > 750 ? "h-60" : "h-45"}
                ${windowWidth <= 750 && "flex-1"}`}
        >
          <div className="flex flex-col items-center text-(--text-orange)/80">
            <svg
              className="transition-colors duration-100 ease-in-out origin-top-right"
              xmlns="http://www.w3.org/2000/svg"
              height={
                windowWidth > 750
                  ? "48px"
                  : windowWidth > 600
                    ? "40px"
                    : windowWidth > 450
                      ? "34px"
                      : "30px"
              }
              viewBox="0 -960 960 960"
              width={
                windowWidth > 750
                  ? "48px"
                  : windowWidth > 600
                    ? "40px"
                    : windowWidth > 450
                      ? "34px"
                      : "30px"
              }
              fill="currentColor"
            >
              <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
            </svg>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileUpload}
              accept=".jpg,.png,.pdf"
              multiple
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className={`border border-(--bg2)/60 rounded-lg px-1 py-0.5 transition-opacity duration-150 ease-in ${windowWidth > 600 ? "text-md" : windowWidth > 450 ? "text-sm" : "text-xs"}`}
            >
              Upload File
            </button>
          </div>
        </div>
        {windowWidth > 750 && (
          <span className="text-(--text)/60 text-sm m-1">
            Excepted File Types: .jpg,.png,.pdf
          </span>
        )}
        <div
          className={`flex flex-col ${windowWidth <= 750 && "flex-1 max-h-45"}`}
        >
          {/* {fileExist ? (
                    <p className={`text-(--text-orange) font-semibold mt-2 ${windowWidth > 600 ? "text-md" : windowWidth > 450 ? "text-sm" : "text-xs"}`}>
                        Previously Uploaded Files:
                    </p>
                ) : (
                    <p className={`text-(--text-orange)/80 font-semibold mt-2 ${windowWidth > 600 ? "text-md" : windowWidth > 450 ? "text-sm" : "text-xs"}`}>
                        No Files Uploaded!!
                    </p>
                )} */}
          {isLoading ? (
            <div className="text-(--text)">
              <span className="flex gap-2 items-center">
                <p>Analyzing Upload...</p>
                <ClipLoader color="currentColor" size={20} />
              </span>
            </div>
          ) : fileExist ? (
            <p
              className={`text-(--text-orange) font-semibold mt-2 ${windowWidth > 600 ? "text-md" : windowWidth > 450 ? "text-sm" : "text-xs"}`}
            >
              Previously Uploaded Files:
            </p>
          ) : (
            <p
              className={`text-(--text-orange)/80 font-semibold mt-2 ${windowWidth > 600 ? "text-md" : windowWidth > 450 ? "text-sm" : "text-xs"}`}
            >
              No Files Uploaded!!
            </p>
          )}
          <ul className="mt-2 overflow-y-auto flex-1 overflow-x-hidden">
            {loggedInUser
              ? allPaymentSlips.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-(--bg) p-1.5 rounded cursor-pointer"
                  >
                    <span
                      className={`text-(--text) hover:text-(--text-orange)/80 ${windowWidth > 1275 ? "text-sm" : windowWidth > 600 ? "text-xs" : "text-[11px]"}`}
                    >
                      Paid To: {file.merchantName || file.paidTo || file.name}
                    </span>
                    <div className="flex gap-0.5">
                      {/* <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            viewDetail(index);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <svg
                                            className="text-(--text) hover:text-blue-500 transition-colors duration-75 ease-in"
                                            xmlns="http://www.w3.org/2000/svg"
                                            height={windowWidth > 1275 ? "24px" : "20px"}
                                            viewBox="0 -960 960 960"
                                            width={windowWidth > 1275 ? "24px" : "20px"}
                                            fill="currentColor"
                                        >
                                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
                                        </svg>
                                    </span> */}
                      <span
                        // onClick={(e) => {
                        //     e.stopPropagation();
                        //     viewDetail(index);
                        // }}
                        className="group relative cursor-pointer"
                      >
                        <svg
                          className={`${windowWidth > 450 ? "text-(--text) hover:text-yellow-500" : "text-yellow-400"} transition-colors duration-75 ease-in`}
                          xmlns="http://www.w3.org/2000/svg"
                          height={
                            windowWidth > 1275
                              ? "24px"
                              : windowWidth > 600
                                ? "20px"
                                : "16px"
                          }
                          viewBox="0 -960 960 960"
                          width={
                            windowWidth > 1275
                              ? "24px"
                              : windowWidth > 600
                                ? "20px"
                                : "16px"
                          }
                          fill="currentColor"
                        >
                          <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                        </svg>
                        <p className="text-(--text) text-xs absolute right-6 top-0 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          Rename Upload
                        </p>
                      </span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteUpload(index);
                        }}
                        className="group relative cursor-pointer"
                      >
                        <svg
                          className={`${windowWidth > 450 ? "text-(--text) hover:text-red-500" : "text-red-400"} transition-colors duration-75 ease-in`}
                          xmlns="http://www.w3.org/2000/svg"
                          height={
                            windowWidth > 1275
                              ? "24px"
                              : windowWidth > 600
                                ? "20px"
                                : "16px"
                          }
                          viewBox="0 -960 960 960"
                          width={
                            windowWidth > 1275
                              ? "24px"
                              : windowWidth > 600
                                ? "20px"
                                : "16px"
                          }
                          fill="currentColor"
                        >
                          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                        </svg>
                        <p className="text-(--text) text-xs absolute right-6 top-0 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          Delete Upload
                        </p>
                      </span>
                    </div>
                  </li>
                ))
              : uploadedSlips.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-(--bg) p-2 rounded mt-2 cursor-pointer"
                  >
                    <span
                      className={`text-(--text) hover:text-(--text-orange)/80 ${windowWidth > 1275 ? "text-sm" : windowWidth > 600 ? "text-xs" : "text-[11px]"}`}
                    >
                      {file.merchantName || file.paidTo || file.name}
                    </span>
                    <div className="flex gap-0.5">
                      {/* <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteUpload(index);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <svg
                                            className="fill-[#E3E3E3] hover:fill-red-500 transition-colors"
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24px"
                                            viewBox="0 -960 960 960"
                                            width="24px"
                                            fill="#E3E3E3"
                                        >
                                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                        </svg>
                                    </span>
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            previewImg(index);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <svg
                                            className="fill-[#E3E3E3] hover:fill-blue-500 transition-colors"
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24px"
                                            viewBox="0 -960 960 960"
                                            width="24px"
                                            fill="#E3E3E3"
                                        >
                                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
                                        </svg>
                                    </span> */}
                      <span className="cursor-pointer">
                        <svg
                          className="text-(--text) hover:text-yellow-500 transition-colors duration-75 ease-in"
                          xmlns="http://www.w3.org/2000/svg"
                          height={
                            windowWidth > 1275
                              ? "24px"
                              : windowWidth > 600
                                ? "20px"
                                : "16px"
                          }
                          viewBox="0 -960 960 960"
                          width={
                            windowWidth > 1275
                              ? "24px"
                              : windowWidth > 600
                                ? "20px"
                                : "16px"
                          }
                          fill="currentColor"
                        >
                          <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                        </svg>
                      </span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteUpload(index);
                        }}
                        className="cursor-pointer"
                      >
                        <svg
                          className="text-(--text) hover:text-red-500 transition-colors duration-75 ease-in"
                          xmlns="http://www.w3.org/2000/svg"
                          height={
                            windowWidth > 1275
                              ? "24px"
                              : windowWidth > 600
                                ? "20px"
                                : "16px"
                          }
                          viewBox="0 -960 960 960"
                          width={
                            windowWidth > 1275
                              ? "24px"
                              : windowWidth > 600
                                ? "20px"
                                : "16px"
                          }
                          fill="currentColor"
                        >
                          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
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
          {onDetail && (
            <ul className="m-3 p-5 bg-(--bg) rounded-lg pt-10">
              <li className="text-lg font-bold text-(--text) mb-2">
                Payment Details
              </li>
              <div className="flex gap-3">
                <span className="text-(--text) font-bold">Paid To:</span>
                <span className="text-(--text-green)">
                  {detail.merchantName || detail.biller}
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-(--text) font-bold">Payment Type:</span>
                <span className="text-(--text-green)">{detail.type}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-(--text) font-bold">Total Amount:</span>
                <span className="text-(--text-green)">
                  {detail.amount || detail.total_amount} {detail.currency}
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-(--text) font-bold">Time:</span>
                <span className="text-(--text-green)">{detail.time}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-(--text) font-bold">Date:</span>
                <span className="text-(--text-green)">{detail.date}</span>
              </div>
              <span className="relative left-55 -top-52" onClick={closeDetail}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="orange"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </span>
            </ul>
          )}
        </div>
      </div>
    );
}

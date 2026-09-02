import React, { useState, useEffect } from 'react'
import { ClipLoader } from 'react-spinners'
import UseAppContext from '../context'
import UseFileUpload from '../hooks/useFileUpload'
import UseFileDelete from '../hooks/useFileDelete'
import UseRenameUpload from '../hooks/useRenameUpload'

export default function Sidebar() {
  const {
    windowWidth,
    loggedInUser,
    uploadedSlips, // If user not logged In, uploadedFile will disappear on refresh
    allPaymentSlips, // Tracks all uploaded files, for logged in users
  } = UseAppContext();

  const {
    fileInputRef,
    isLoading,
    handleFileUpload,
    rawFiles,
  } = UseFileUpload();

  const { 
    DeleteUpload, 
    deletingId,
    isLoading : isDeleteLoading 
  } = UseFileDelete();

  const {
    renameUpload,
    isLoading : isRenameLoading,
  } = UseRenameUpload();

  const [isRenaming, setIsRenaming] = useState(null);
  const [renameId, setRenameId] = useState(false);
  const [fileName, setFileName] = useState("");

  const [rawPreviews, setRawPreviews] = useState([]);

  useEffect(() => {
    if (!rawFiles || rawFiles.length === 0) {
      setRawPreviews([]);
      return;
    }

    const previews = rawFiles.map((file, i) => ({
      id: `raw-${i}-${file.name}`,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    }));

    setRawPreviews(previews);

    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, [rawFiles]);

  return (
    <div
      className={`min-w-0 h-full ${windowWidth > 750 ? "w-full flex flex-col bg-(--code-bg) p-4 rounded-3xl" : "flex gap-4 items-start w-full"} `}
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
        className={`flex flex-col min-w-0 ${windowWidth <= 750 && "flex-1 max-h-45"}`}
      >
        {isLoading ? (
           <div className="flex flex-col gap-1 mb-1">
            <div className="flex items-center gap-2 text-(--text-orange)/80 p-1">
              <p>Scanning upload...</p>
              <ClipLoader color="currentColor" size={18} />
            </div>
            {rawPreviews.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {rawPreviews.map((preview) => (
                  <div
                    key={preview.id}
                    className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-(--border)"
                    title={preview.name}
                  >
                    <img
                      src={preview.previewUrl}
                      alt={preview.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (loggedInUser ? allPaymentSlips : uploadedSlips).length === 0 ? (
          <p
            className={`text-(--text-orange)/80 font-semibold mt-2 ${windowWidth > 600 ? "text-md" : windowWidth > 450 ? "text-sm" : "text-xs"}`}
          >
            No Files Uploaded!!
          </p>
        ) : (
          <p
            className={`text-(--text-orange) font-semibold mt-2 ${windowWidth > 600 ? "text-md" : windowWidth > 450 ? "text-sm" : "text-xs"}`}
          >
            Previously Uploaded Files:
          </p>
        )}
        <ul className="mt-2 overflow-y-auto flex-1 overflow-x-hidden min-w-0">
          {loggedInUser
            ? allPaymentSlips.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between gap-2 items-center bg-(--bg) p-1.5 cursor-pointer rounded-lg my-0.5 w-full min-w-0"
                >
                  {" "}
                  {isRenaming && renameId === file.id ? (
                    <div className="flex items-center gap-3 w-full min-w-0 overflow-hidden">
                      <input
                        className={`flex-1 min-w-0 rounded-lg border border-(--bg2) text-(--text-orange) ${windowWidth > 600 ? "text-sm" : "text-xs"} focus:outline-0 px-2`}
                        placeholder="Enter Display Name:"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                      />
                      {isRenameLoading ? (
                         <div className="flex items-center gap-1 text-(--text-orange)/80 text-xs p-0.5">
                          <p>Renaming...</p>
                          <ClipLoader color="currentColor" size={15} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span
                            onClick={async (e) => {
                              e.preventDefault();
                              await renameUpload(index, file, fileName);
                              setIsRenaming(false);
                              setRenameId(null);
                              setFileName("");
                            }}
                              className="group relative cursor-pointer text-(--text-green) hover:text-green-500"
                            >
                            <svg
                              className="border border-(--sub-text-green) hover:border-(--text-green) rounded-md"
                              xmlns="http://www.w3.org/2000/svg"
                              height={windowWidth > 800 ? "24px" : "20px"}
                              viewBox="0 -960 960 960"
                              width={windowWidth > 800 ? "24px" : "20px"}
                              fill="currentColor"
                            >
                              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                            </svg>
                            <p className="text-(--text) text-[11px] absolute right-6 top-0 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                Rename
                            </p>
                          </span>
                          <span
                            onClick={() => {
                              setIsRenaming(false);
                              setRenameId(null);
                              setFileName("");
                            }}
                              className="group relative cursor-pointer text-(--text) hover:text-(--text)/60"
                            >
                            <svg
                              className="border border-(--text)/80 hover:border-(--text)/40 rounded-md"
                              xmlns="http://www.w3.org/2000/svg"
                              height={windowWidth > 800 ? "24px" : "20px"}
                              viewBox="0 -960 960 960"
                              width={windowWidth > 800 ? "24px" : "20px"}
                              fill="currentColor"
                            >
                              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                            </svg>
                            <p className="text-(--text) text-[11px] absolute right-6 top-0 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                Cancel
                            </p>
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <span
                        className={`min-w-0 truncate flex gap-1 items-center text-(--text) hover:text-(--text-orange)/80 ${windowWidth > 1275 ? "text-sm" : windowWidth > 600 ? "text-xs" : "text-[11px]"}`}
                      >
                        <p className="text-(--text-green) shrink-0">
                          {" "}
                          Paid To:
                        </p>
                        <p className="truncate">
                          {file.name || file.merchantName || file.paidTo}
                        </p>
                      </span>
                      {isDeleteLoading && deletingId === file.id ? (
                        <div className="flex items-center gap-2 text-(--text-orange)/80 p-1 mb-1 text-xs">
                          <p>Deleting...</p>
                          <ClipLoader color="currentColor" size={18} />
                        </div>
                      ) : (
                        <div className="flex gap-0.5">
                          <span
                            onClick={() => {
                              setIsRenaming(true);
                              setRenameId(file.id);
                              setFileName(file.name || file.merchantName || file.paidTo);
                            }}
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
                              DeleteUpload(index);
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
                      )}
                    </>
                  )}
                </li>
              ))
            : uploadedSlips.map((file, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-(--bg) p-2 rounded mt-2 cursor-pointer w-full min-w-0"
                >
                  <span
                    className={`min-w-0 truncate text-(--text) hover:text-(--text-orange)/80 ${windowWidth > 1275 ? "text-sm" : windowWidth > 600 ? "text-xs" : "text-[11px]"}`}
                  >
                    {file.merchantName || file.paidTo || file.name}
                  </span>
                  <div className="flex gap-0.5">
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
                        DeleteUpload(index);
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
      </div>
    </div>
  );
}

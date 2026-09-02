import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import UseRenameUpload from "../../hooks/useRenameUpload";
import UseFileDelete from "../../hooks/useFileDelete";

export default function UploadsTable({
  windowWidth,
  paymentData,
  isLoading,
  isUploadLoading = false,
  rawPreviews = [],
  fileInputRef,
  handleFileUpload,
  onViewImage,
}) {
  const compact = windowWidth <= 550; // mobile compact table layout
  const large = windowWidth > 1275;
  const showActionbuttons = windowWidth <= 750; // when side is no longer rendered exposes the action button

  const data = paymentData;

  const titleClass = compact
    ? "py-1 px-2 w-fit text-sm text-(--text-orange) border border-(--border)/60 bg-(--code-bg) rounded-lg shrink-0"
    : large
      ? "py-1 px-2 my-2 text-lg w-fit text-(--text-orange) border border-(--border)/60 bg-(--code-bg) rounded-lg shrink-0"
      : "py-1 px-2 w-fit text-(--text-orange) border border-(--border)/60 bg-(--code-bg) rounded-lg shrink-0";

  const [onEdit, setOnEdit] = useState(false);
  const [choosenEditId, setChoosenEditId] = useState(null); // store the id of the item that is choosen to be edited
  const [fileName, setFileName] = useState("");

  const { renameUpload, isLoading: isRenameLoading } = UseRenameUpload();

  const [onDelete, setOnDelete] = useState(false);
  const { 
      DeleteUpload, 
      deletingId,
      isLoading : isDeleteLoading 
  } = UseFileDelete();

  return (
    <div
      className={`bg-(--code-bg) border border-(--border) rounded-lg flex-1 flex flex-col overflow-hidden ${
        compact ? "p-2 min-h-80" : "p-3 min-h-60"
      }`}
    >
      <div className="flex items-center justify-between">
        {showActionbuttons && (
          <p className={titleClass}>All Uploads</p>
        )}

        {showActionbuttons && (
          <div
            className={`flex items-center ${windowWidth > 400 ? "gap-2" : "gap-1"}`}
          >
            <button
              onClick={() => {
                setOnEdit(!onEdit);
                setChoosenEditId(null);
                setFileName("");
              }}
              className={`flex gap-1 text-black items-center border border-(--sub-text-green)/60 bg-(--text-green)/80 rounded-lg px-1 py-0.5`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={windowWidth > 450 ? "22px" : "20px"}
                viewBox="0 -960 960 960"
                width={windowWidth > 450 ? "22px" : "20px"}
                fill="currentColor"
              >
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
              </svg>
              {windowWidth > 500 && (
                <p
                  className={
                      windowWidth > 450
                        ? "text-sm"
                        : "text-xs"
                  }
                >
                  {onEdit ? "Back" : "Edit"}
                </p>
              )}
            </button>
            <button
              onClick={() => setOnDelete(!onDelete)}
              className={`flex gap-1 text-black items-center border border-red-500 bg-red-400 rounded-lg px-1 py-0.5`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={windowWidth > 450 ? "22px" : "20px"}
                viewBox="0 -960 960 960"
                width={windowWidth > 450 ? "22px" : "20px"}
                fill="currentColor"
              >
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
              </svg>
              {windowWidth > 500 && (
                <p
                  className={
                     windowWidth > 450
                        ? "text-sm"
                        : "text-xs"
                  }
                >
                  Delete
                </p>
              )}
            </button>
            <div className="flex gap-1 bg-(--bg2) text-black items-center border border-(--bg2)/60 rounded-lg px-1 py-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={windowWidth > 600 ? "24px" : "20px"}
                viewBox="0 -960 960 960"
                width={windowWidth > 600 ? "24px" : "20px"}
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
                className={
                  windowWidth > 450
                      ? "text-sm"
                      : "text-xs"
                }
              >
                {windowWidth > 500 ? "Upload File" : "Upload"}
              </button>
            </div>
          </div>
        )}
      </div>

      <ul className="relative px-2 py-1 text-xs h-full min-h-0 flex flex-col">
        {isUploadLoading && (
          <div className="flex flex-col gap-1 mb-1">
            <div className="flex items-center gap-2 text-(--text-orange)/80 text-sm p-1">
              <p>Scanning upload...</p>
              <ClipLoader color="currentColor" size={14} />
            </div>
            {rawPreviews.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {rawPreviews.map((preview) => (
                  <div
                    key={preview.id}
                    onClick={() => onViewImage?.(preview)}
                    className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-(--border) cursor-pointer"
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
        )}

        {data.length === 0 && !isUploadLoading ? (
          <p
            className={
              compact
                ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-(--text)/80 w-fit font-semibold bg-(--bg)"
                : "text-(--text)/80 w-fit font-semibold bg-(--bg) border border-(--border) rounded-md p-1"
            }
          >
            Empty Payments List
          </p>
        ) : (
          !compact && (
            <li className="grid grid-cols-3 p-2 bg-(--bg) text-[13px] rounded-lg text-(--text-orange)/90 font-bold shrink-0">
              <p className="justify-self-start">Merchant/Biller</p>
              <p className="justify-self-center">
                {windowWidth > 900 ? "Date of Transaction" : "Date/Time"}
              </p>
              <p className="justify-self-end">
                {windowWidth > 900 ? "Transaction Amount" : "Amount"}
              </p>
            </li>
          )
        )}

        {isLoading ? (
          <div className="flex-1 w-full flex justify-center items-center text-(--text-orange)/80">
            <span className="flex gap-2 items-center">
              <p>Loading...</p>
              <ClipLoader color="currentColor" size={20} />
            </span>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
            {data.map((item, index) => {
              const merchantName =
                item.name || item.merchantName || item.paidTo;

              const rawDate = item.transaction_date || item.date || "";
              const formattedDate = rawDate.includes("T")
                ? rawDate.split("T")[0]
                : rawDate;
              const displayDate = item.time
                ? `${formattedDate} ${item.time}`
                : formattedDate;

              const displayAmount = item.amount ?? item.total_amount ?? "0";

              return compact ? (
                onEdit ? (
                  <div key={index} className="w-full flex items-center gap-2">
                    <svg
                      onClick={() => {
                        setChoosenEditId(item.id);
                        setFileName(
                          item.name || item.merchantName || item.paidTo,
                        );
                        setOnEdit(false);
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#e3e3e3"
                    >
                      <path d="M200-200v80q-33 0-56.5-23.5T120-200h80Zm-80-80v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm80-160h-80q0-33 23.5-56.5T200-840v80Zm80 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 560h80q0 33-23.5 56.5T760-120v-80Zm0-80v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80q33 0 56.5 23.5T840-760h-80Z" />
                    </svg>
                    <li
                      onClick={() => {
                        setChoosenEditId(item.id);
                        setFileName(
                          item.name || item.merchantName || item.paidTo,
                        );
                        setOnEdit(false);
                      }}
                      className="w-full flex items-center justify-between min-w-0 bg-(--bg) mt-1 mb-1 p-2 rounded-lg"
                    >
                      <p className="font-semibold">{merchantName}</p>
                      <div className="flex flex-col items-end">
                        <p className="text-(--text-light-orange) text-[11px]">
                          {displayDate}
                        </p>
                        <p className="text-(--text-green) font-semibold text-[13px]">
                          {displayAmount} {item.currency}
                        </p>
                      </div>
                    </li>
                  </div>
                ) : choosenEditId === item.id ? (
                  <div
                    key={index}
                    className="flex items-center gap-3 w-full min-w-0 overflow-hidden bg-(--bg) mt-1 mb-1 p-2 rounded-lg"
                  >
                    <input
                      className={`flex-1 min-w-0 rounded-lg border border-(--bg2) text-(--text-orange) ${windowWidth > 600 ? "text-sm" : "text-xs"} focus:outline-0 px-2 py-1`}
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
                      <li className="flex items-center gap-1">
                        <span
                          onClick={async (e) => {
                            e.preventDefault();
                            await renameUpload(index, item, fileName);
                            setOnEdit(false);
                            setChoosenEditId(null);
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
                            setOnEdit(false);
                            setChoosenEditId(null);
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
                      </li>
                    )}
                  </div>
                ) : onDelete ? (
                  <div key={index} className="w-full flex items-center gap-2">
                    <svg
                      onClick={async () => {
                        await DeleteUpload(index, item);
                        setOnDelete(false);
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      height={windowWidth > 600 ? "24px" : "20px"}
                      viewBox="0 -960 960 960"
                      width={windowWidth > 600 ? "24px" : "20px"}
                      fill="red"
                    >
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </svg>
                    <li
                      onClick={async () => {
                        await DeleteUpload(index, item);
                        setOnDelete(false);
                      }}
                      className="w-full flex items-center justify-between min-w-0 bg-(--bg) mt-1 mb-1 p-2 rounded-lg"
                    >
                      <p className="font-semibold">{merchantName}</p>
                      {isDeleteLoading && deletingId === item.id ? (
                        <div className="flex items-center gap-2 text-(--text-orange)/80 p-1 mb-1 text-xs">
                          <p>Deleting...</p>
                          <ClipLoader color="currentColor" size={18} />
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <p className="text-(--text-light-orange) text-[11px]">
                            {displayDate}
                          </p>
                          <p className="text-(--text-green) font-semibold text-[13px]">
                            {displayAmount} {item.currency}
                          </p>
                        </div>
                      )}
                    </li>
                  </div>
                ) : (
                  <li
                    key={index}
                    onClick={() => onViewImage?.(item)}
                    className="w-full flex items-center justify-between min-w-0 bg-(--bg) mt-1 mb-1 p-2 rounded-lg"
                  >
                    <p className="font-semibold">{merchantName}</p>
                    <div className="flex flex-col items-end">
                      <p className="text-(--text-light-orange) text-[11px]">
                        {displayDate}
                      </p>
                      <p className="text-(--text-green) font-semibold text-[13px]">
                        {displayAmount} {item.currency}
                      </p>
                    </div>
                  </li>
                )
              ) : onEdit ? (
                <div key={index} className="w-full flex items-center gap-2">
                  <svg
                    onClick={() => {
                      setChoosenEditId(item.id);
                      setFileName(
                        item.name || item.merchantName || item.paidTo,
                      );
                      setOnEdit(false);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#e3e3e3"
                  >
                    <path d="M200-200v80q-33 0-56.5-23.5T120-200h80Zm-80-80v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm80-160h-80q0-33 23.5-56.5T200-840v80Zm80 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 560h80q0 33-23.5 56.5T760-120v-80Zm0-80v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80q33 0 56.5 23.5T840-760h-80Z" />
                  </svg>
                  <li
                    onClick={() => {
                      setChoosenEditId(item.id);
                      setFileName(
                        item.name || item.merchantName || item.paidTo,
                      );
                      setOnEdit(false);
                    }}
                    className="w-full grid grid-cols-3 min-w-0 bg-(--bg) mt-1 mb-1 p-2 rounded-lg"
                  >
                    <p className="justify-self-start">{merchantName}</p>
                    <p className="text-(--text-light-orange) justify-self-center">
                      {displayDate}
                    </p>
                    <p className="text-(--text-green) text-[13px] font-semibold justify-self-end">
                      {displayAmount} {item.currency}
                    </p>
                  </li>
                </div>
              ) : choosenEditId === item.id ? (
                <div
                  key={index}
                  className="flex items-center gap-3 w-full min-w-0 overflow-hidden bg-(--bg) mt-1 mb-1 p-1 rounded-lg"
                >
                  <input
                    className={`flex-1 min-w-0 rounded-lg border border-(--bg2) text-(--text-orange) ${windowWidth > 600 ? "text-sm" : "text-xs"} focus:outline-0 px-2 py-1`}
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
                    <li className="flex items-center gap-1">
                      <span
                        onClick={async (e) => {
                          e.preventDefault();
                          await renameUpload(index, item, fileName);
                          setOnEdit(false);
                          setChoosenEditId(null);
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
                          setOnEdit(false);
                          setChoosenEditId(null);
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
                    </li>
                  )}
                </div>
              ) : onDelete ? (
                <div key={index} className="w-full flex items-center gap-2">
                  <svg
                    onClick={async () => {
                      await DeleteUpload(index, item);
                      setOnDelete(false);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    height={windowWidth > 600 ? "24px" : "20px"}
                    viewBox="0 -960 960 960"
                    width={windowWidth > 600 ? "24px" : "20px"}
                    fill="red"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                  <li
                    onClick={async () => {
                      await DeleteUpload(index, item);
                      setOnDelete(false);
                    }}
                    className={`flex-1 ${isDeleteLoading && deletingId === item.id ? "flex items-center justify-between" : "grid grid-cols-3"}  min-w-0 bg-(--bg) mt-1 mb-1 p-2 rounded-lg`}
                  >
                    <p className="font-semibold">{merchantName}</p>
                    {isDeleteLoading && deletingId === item.id ? (
                      <div className="flex items-center gap-2 text-(--text-orange)/80 p-1 mb-1 text-xs">
                        <p>Deleting...</p>
                        <ClipLoader color="currentColor" size={18} />
                      </div>
                    ) : (
                      <>
                        <p className="text-(--text-light-orange) justify-self-center">
                          {displayDate}
                        </p>
                        <p className="text-(--text-green) text-[13px] font-semibold justify-self-end">
                          {displayAmount} {item.currency}
                        </p>
                      </>
                    )}
                  </li>
                </div>
              ) : (
                <li
                  key={index}
                  onClick={() => onViewImage?.(item)}
                  className="grid grid-cols-3 min-w-0 bg-(--bg) mt-1 mb-1 p-2 rounded-lg"
                >
                  <p className="justify-self-start">{merchantName}</p>
                  <p className="text-(--text-light-orange) justify-self-center">
                    {displayDate}
                  </p>
                  <p className="text-(--text-green) text-[13px] font-semibold justify-self-end">
                    {displayAmount} {item.currency}
                  </p>
                </li>
              );
            })}
          </div>
        )}
      </ul>
    </div>
  );
}

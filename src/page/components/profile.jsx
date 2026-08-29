import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UseAppContext from "../../context";

export default function Profile() {
  const { loggedInUser, windowWidth } = UseAppContext();

  const navigate = useNavigate();
  const goToDashboard = () => {
    navigate("/");
  };

  const [profile, setProfile] = useState(null);
  const fileInputRef = useRef(null);


  const handleProfile = (imgFile) => {
    if (!loggedInUser.userID) {
      alert("You're not Logged In");
      return;
    }

    if (!imgFile) {
      alert("No profile selected");
      return;
    }

    if (imgFile instanceof File) {
      const objectURL = URL.createObjectURL(imgFile);
      setProfile(objectURL);
    } else {
      setProfile(imgFile);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleProfile(file);
  };

  const triggerFileDialog = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="rounded-3xl h-full w-full flex flex-col items-center gap-5 bg-(--bg) p-4">
      <div
        className="flex items-center gap-3 self-start text-(--text-orange)"
        onClick={goToDashboard}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="30px"
          viewBox="0 -960 960 960"
          width="30px"
          fill="currentColor"
        >
          <path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z" />
        </svg>
        <p className="border border-(--bg2)/80 rounded-lg py-0.5 px-2">
          User Profile
        </p>
      </div>
      <div className="w-30 h-30 rounded-full bg-(--code-bg) text-(--text) text-sm flex items-center justify-center border border-(--border)">
        {profile ? (
          <img
            src={profile}
            alt={"Profile Image"}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
            <div className="flex flex-col gap-1 items-center">
               <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={onFileChange}
                accept=".jpg,.png,"
              />
              <p>Profile Not Set</p>
              <div 
                onClick={triggerFileDialog}
                className="flex items-center text-[10px] text-(--text) hover:text-(--text-orange) border border-(--bg2) rounded-full px-1">
                <p>Add Profile</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="currentColor"
                >
                  <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                </svg>
              </div>
            </div>
        )}
      </div>
      <ul className="w-full max-w-3xl flex flex-col border border-(--border) bg-(--code-bg) rounded-2xl px-2 py-1">
        <li className="grid grid-cols-[100px_minmax(0,1fr)_40px] gap-5 items-center px-4 rounded-xl">
          <p className="bg-(--bg2)/90 text-black p-1 rounded-lg text-center">
            Email
          </p>
          <input
            value={loggedInUser?.email || "Info Not Available"}
            readOnly={true}
            className="bg-(--bg-green) p-1 text-center text-(--text) rounded-lg"
          />
          <button className="text-(--text) hover:text-(--text-orange) text-xs p-1 flex flex-col items-center">
            <svg
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
            <p>Edit</p>
          </button>
        </li>
        <li className="grid grid-cols-[100px_minmax(0,1fr)_40px] gap-5 items-center px-4 rounded-xl">
          <p className="bg-(--bg2)/90 text-black p-1 rounded-lg text-center">
            Username
          </p>
          <input
            value={loggedInUser?.username || "Info Not Available"}
            readOnly={true}
            className="bg-(--bg-green) p-1 text-center text-(--text) rounded-lg"
          />
          <button className="text-(--text) hover:text-(--text-orange) text-xs p-1 flex flex-col items-center">
            <svg
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
            <p>Edit</p>
          </button>
        </li>
        <li className="grid grid-cols-[100px_minmax(0,1fr)_40px] items-center gap-5 px-4 rounded-xl">
          <p className="bg-(--bg2)/90 text-black p-1 rounded-lg text-center">
            Password
          </p>
          <input
            value={loggedInUser?.username || "Info Not Available"}
            readOnly={true}
            className="bg-(--bg-green) p-1 text-center text-(--text) rounded-lg"
          />
          <button className="text-(--text) hover:text-(--text-orange) text-xs p-1 flex flex-col items-center">
            <svg
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
            <p>Edit</p>
          </button>
        </li>
      </ul>
    </div>
  );
}

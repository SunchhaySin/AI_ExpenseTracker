import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UseAppContext, { API_BASE_URL } from "../../context";
import { getAuthHeader } from "../../utils/token";
import { ClipLoader } from "react-spinners";
import UseSaveProfileImage from "../../hooks/useSaveProfileImage";

export default function Profile() {
  const { 
    loggedInUser, 
    windowWidth, 
    setLoggedInUser, 
    setIsOpenProfile,
    profileImage, // Contians the profile image url constructed and fetched from the server
    fetchProfilePicture // returns a callback that fetches the profileImagUrl from Server (Use on Save profile)
  } = UseAppContext();

  const [profileUrl, setProfileUrl] = useState(null); // Stores the profile image URL for display in the UI (on initial upload)
  const [profileFile, setProfileFile] = useState(null);  // Stores the actual File object for uploading to the server

  const fileInputRef = useRef(null);

  const {
    SaveProfileImage,
    error: profileImgError,
    setError,
    isLoading: profileImgLoading,
    success: profileImgSuccess,
    setSuccess,
  } = UseSaveProfileImage();

  const navigate = useNavigate();
  const [showActionButton, setShowActionButton] = useState(false);

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
      setProfileUrl(objectURL); // for displaying the image directly in the UI
      setProfileFile(imgFile); // keep the actual File for uploading into database
    } else {
      setProfileUrl(imgFile);
    }
  };
  useEffect(() => {
    return () => {
      if (profileUrl && profileUrl.startsWith("blob:")) {
        URL.revokeObjectURL(profileUrl);
      }
    };
  }, [profileUrl]);
  
  useEffect(() => {
    if (profileImgError || profileImgSuccess) {
      const t1 = setTimeout(async () => {
        setError(null); setSuccess(null)
        if (profileImgSuccess) {
          await fetchProfilePicture();
          setProfileUrl(null);
          setProfileFile(null);
        };
      }, 2000);

      return () => {
        clearTimeout(t1)
      };
    }
  }, [profileImgError, profileImgSuccess]);

  useEffect(() => { 
    if(profileImgError || profileImgSuccess) {
      const t = setTimeout(() => {
        setShowActionButton(false);
      }, 2000)
      return () => clearTimeout(t)
    } else if (!profileImgError || !profileImgSuccess || profileUrl) {
      setShowActionButton(true);
    }
  }, [loggedInUser, profileImgError, profileImgSuccess]);
  
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleProfile(file);
  };

  const triggerFileDialog = () => {
    fileInputRef.current.click();
  };

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [newEmail, setNewEmail] = useState(loggedInUser?.email);
  const [newUsername, setNewUsername] = useState(loggedInUser?.username);
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");

  const [viewPassword, setViewPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isUsernameLoading, setIsUsernameLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  async function ConfirmEmailEdit() {
    if (!newEmail || newEmail.trim() === "") {
      setEmailError("Email Field is Empty");
      return;
    }
    setIsEmailLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/profile/update/email`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!res.ok) {
        const error = await res.json();
        setEmailError(error.error || "Failed to update email");
        return;
      }

      const data = await res.json();
      setEmailError("");
      alert(data.message || "Email updated successfully");
      setLoggedInUser((prev) => ({ ...prev, email: data.data }));
      setIsEditingEmail(false);
    } catch (err) {
      console.error(err.message);
      setEmailError(err.message);
    } finally {
      setIsEmailLoading(false);
    }
  }

  async function ConfirmUsernameEdit() {
    if (!newUsername || newUsername.trim() === "") {
      setUsernameError("Username Field is Empty");
      return;
    }
    setIsUsernameLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/profile/update/username`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (!res.ok) {
        const error = await res.json();
        setUsernameError(error.error || "Failed to update username");
        return;
      }
      const data = await res.json();
      setUsernameError("");
      alert(data.message || "Username updated successfully");
      setLoggedInUser((prev) => ({ ...prev, username: data.data }));
      setIsEditingUsername(false);
    } catch (err) {
      console.error(err.message);
      setUsernameError(err.message);
    } finally {
      setIsUsernameLoading(false);
    }
  }

  async function ConfirmPasswordChange() {
    if (
      !newPassword ||
      newPassword.trim() === "" ||
      !newConfirmPassword ||
      newConfirmPassword.trim() === ""
    ) {
      setPasswordError("Password Fields are Emtpy");
      return;
    }

    if (newPassword.trim() !== newConfirmPassword.trim()) {
      setPasswordError("Password Do Not Match!");
      return;
    }

    setIsPasswordLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/profile/update/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          password: newPassword,
          confirmPassword: newConfirmPassword,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        setPasswordError(error.error || "Failed to update password");
        return;
      }
      const data = await res.json();
      setUsernameError("");
      alert(data.message || "Password updated successfully");
      setIsEditingPassword(false);
    } catch (err) {
      console.error(err.message);
      setPasswordError(err.message);
    } finally {
      setIsPasswordLoading(false);
    }
  }

  return (
    <div className="rounded-3xl h-full w-full flex flex-col items-center gap-5 bg-(--bg) p-4">
      <div
        className="flex items-center gap-3 self-start text-(--text-orange)"
        onClick={
          windowWidth > 1275
            ? () => setIsOpenProfile(false)
            : () => navigate("/dashboard")
        }
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
        <p className="font-semibold">User Profile</p>
      </div>
      <div className="flex flex-col items-center gap-3 ">
        <div className="w-30 h-30 rounded-full bg-(--code-bg) text-(--text) text-sm flex items-center justify-center border border-(--border)">
          <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={onFileChange}
                accept=".jpg,.png,"
              />
          {profileUrl || profileImage ? (
            <img
              src={profileUrl || profileImage} // profileUrl overrides profileImage when a new file is picked
              alt="Profile Image"
              className="w-full h-full object-cover rounded-full cursor-pointer"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="80px"
                viewBox="0 -960 960 960"
                width="80px"
                fill="#e3e3e3"
              >
                <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z" />
              </svg>
            </div>
          )}
        </div>

        {/* Update Status Indicators*/}
        {profileImgError && (
          <p className="text-red-500 text-[11px] text-center">
            {profileImgError}
          </p>
        )}
        {profileImgSuccess && (
          <p className="text-green-500 text-[11px] text-center">
            {profileImgSuccess}
          </p>
        )}

        {/* Action Buttons */}
        {profileUrl && showActionButton ? (
          <div className="flex items-center">
            <button
              onClick={() => SaveProfileImage(profileFile)}
              className="group relative flex items-center text-xs text-(--text) hover:bg-(--bg2)/80 bg-(--bg2) rounded-full px-2 py-1"
            >
              {profileImgLoading
                ?
                <span className="flex items-center gap-2 justify-center">
                  Saving Profile...
                  <ClipLoader color="currentColor" size={16} />
                </span>
                : "Save Profile"}
              <p className="text-[10px] absolute top-7 -right-4 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Save Profile Image
              </p>
            </button>
            <button className="border border-(--text) hover:bg-(--bg2)/80 rounded-xl px-2 py-0.75 text-xs text-(--text) ml-2" 
              onClick={() => setProfileUrl(null)}>
              Back
            </button>
          </div>
        ) : (
          <button
            onClick={triggerFileDialog}
            className="flex items-center text-xs text-(--text) hover:text-(--text-orange) border border-(--bg2) rounded-full px-2 py-1"
          >
            {profileImage ? "Change Profile" : "Add Profile"}
          </button>
        )}
      </div>
      <ul className="w-full max-w-md flex flex-col gap-2 rounded-2xl ">
        <li className="flex flex-col items-start justify-center px-2 rounded-xl">
          <p className="text-(--text-orange) font-semibold rounded-lg text-center">
            Email
          </p>
          <div className="w-full flex items-center gap-2 min-w-0">
            {isEditingEmail ? (
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1 min-w-0 text-(--text-green) border border-(--border-green) text-start rounded-lg px-2 focus:outline-0"
              />
            ) : (
              <input
                value={loggedInUser?.email || "Info Not Available"}
                readOnly={true}
                className="flex-1 min-w-0 text-(--text-green) border border-(--border-green) text-start rounded-lg px-2 focus:outline-0"
              />
            )}
            {isEditingEmail ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => ConfirmEmailEdit()}
                  className="bg-green-400/80 hover:bg-green-400 rounded-lg px-1 py-0.5 text-xs"
                >
                  {isEmailLoading ? "Confirming..." : "Confirm"}
                </button>
                <button
                  onClick={() => {
                    setIsEditingEmail(false);
                    setEmailError("");
                  }}
                  className="bg-red-400/80 hover:bg-red-400 rounded-lg px-1 py-0.5 text-xs"
                >
                  Back
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsEditingEmail(true);
                  setNewEmail(loggedInUser?.email);
                }}
                className="text-(--text) hover:text-(--text-orange) text-xs p-1 flex flex-col items-center "
              >
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
            )}
          </div>
          {emailError && (
            <p className="text-red-500 text-[11px]">{emailError}</p>
          )}
        </li>
        <hr className="text-(--text)/20" />
        <li className="flex flex-col items-start justify-center px-2 rounded-xl">
          <p className="text-(--text-orange) font-semibold rounded-lg text-center">
            Username
          </p>
          <div className="w-full flex items-center gap-2 min-w-0">
            {isEditingUsername ? (
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="flex-1 min-w-0 text-(--text-green) border border-(--border-green) text-start rounded-lg px-2 focus:outline-0"
              />
            ) : (
              <input
                value={loggedInUser?.username || "Info Not Available"}
                readOnly={true}
                className="flex-1 min-w-0 text-(--text-green) border border-(--border-green) text-start rounded-lg px-2 focus:outline-0"
              />
            )}
            {isEditingUsername ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => ConfirmUsernameEdit()}
                  className="bg-green-400/80 hover:bg-green-400 rounded-lg px-1 py-0.5 text-xs"
                >
                  {isUsernameLoading ? "Confirming..." : "Confirm"}
                </button>
                <button
                  onClick={() => {
                    setIsEditingUsername(false);
                    setUsernameError("");
                  }}
                  className="bg-red-400/80 hover:bg-red-400 rounded-lg px-1 py-0.5 text-xs"
                >
                  Back
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsEditingUsername(true);
                  setNewUsername(loggedInUser?.username);
                }}
                className="text-(--text) hover:text-(--text-orange) text-xs p-1 flex flex-col items-center"
              >
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
            )}
          </div>
          {usernameError && (
            <p className="text-red-500 text-[11px]">{usernameError}</p>
          )}
        </li>
        <hr className="text-(--text)/20" />
        <li className="flex flex-col items-start justify-center px-2 rounded-xl">
          <p className="text-(--text-orange) font-semibold rounded-lg text-center">
            Password
          </p>
          <div className="w-full flex items-center gap-2 ">
            {isEditingPassword ? (
              <div className="flex-1 flex items-center justify-between text-(--text-green) border border-(--border-green) text-start rounded-lg gap-2 px-1">
                <input
                  type={viewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter New Password "
                  className="focus:outline-0 text-sm p-0.5 w-full"
                />
                {viewPassword ? (
                  <svg
                    onClick={() => setViewPassword(false)}
                    className="text-(--text)"
                    xmlns="http://www.w3.org/2000/svg"
                    height="18px"
                    viewBox="0 -960 960 960"
                    width="18px"
                    fill="currentColor"
                  >
                    <path d="M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z" />
                  </svg>
                ) : (
                  <svg
                    onClick={() => setViewPassword(true)}
                    className="text-(--text)"
                    xmlns="http://www.w3.org/2000/svg"
                    height="18px"
                    viewBox="0 -960 960 960"
                    width="18px"
                    fill="currentColor"
                  >
                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                  </svg>
                )}
              </div>
            ) : (
              <input
                type="password"
                value="***********"
                readOnly={true}
                className="flex-1 text-(--text-green) border border-(--border-green) text-start rounded-lg px-2 focus:outline-0"
              />
            )}
            {!isEditingPassword && (
              <button
                onClick={() => setIsEditingPassword(true)}
                className="text-(--text) hover:text-(--text-orange) text-xs p-1 flex flex-col items-center"
              >
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
            )}
          </div>
        </li>
        {isEditingPassword && (
          <div>
            <li className="flex flex-col items-start justify-center px-2 rounded-xl">
              <p className="text-(--text-orange) font-semibold rounded-lg text-center">
                Confirm Password
              </p>
              <div className="w-full flex items-center gap-2">
                <input
                  type={viewPassword ? "text" : "password"}
                  value={newConfirmPassword}
                  onChange={(e) => setNewConfirmPassword(e.target.value)}
                  className="flex-1 text-(--text-green) border border-(--border-green) text-start rounded-lg px-2 focus:outline-0 text-sm p-0.5"
                  placeholder="Confirm Password"
                />
              </div>
            </li>
            {passwordError && (
              <p className="text-red-500 text-sm m-2 text-center">
                {passwordError}
              </p>
            )}
            <div className="flex flex-col items-center justify-center m-5 gap-2">
              <button
                onClick={() => ConfirmPasswordChange()}
                className="bg-green-400/80 hover:bg-green-400 rounded-lg px-2 py-1 font-semibold w-full"
              >
                {isPasswordLoading ? (
                  <span className="flex items-center gap-2 justify-center">
                    Confirming...
                    <ClipLoader color="currentColor" size={16} />
                  </span>
                ) : (
                  "Change Password"
                )}
              </button>
              <button
                onClick={() => {
                  setIsEditingPassword(false);
                  setPasswordError("");
                }}
                className="bg-red-400/80 hover:bg-red-400 rounded-lg px-2 py-1 font-semibold w-full "
              >
                Back
              </button>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import UseAppContext from "../context";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../utils/token";

export default function Header() {
  const {
    loggedInUser,
    setLoggedInUser,
    theme,
    changeTheme,
    windowWidth,
    isOpenConversion,
    isOpenProfile,
    openConversion,
    openProfile,
    closePanels,
    profileImage,
  } = UseAppContext();

  const isLoggedIn = Boolean(loggedInUser?.username || loggedInUser?.userID);
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [dropdown, setDropdown] = useState(false);

  function Logout() {
    const confirmed = confirm("Are you sure you want to log out?");
    if (!confirmed) return;
    try {
      setDropdown(false);
      setLoggedInUser(null);
      clearToken(); // deletes token from localStorage
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <header
      className={`w-full flex justify-between py-2 px-4 ${isLoggedIn && "border-b border-(--bg2)/50 rounded-2xl"} `}
    >
      {/* Date/Time */}
      <div
        className={`flex gap-4 items-center
                        ${windowWidth > 1275 ? "text-md" : "text-sm"}`}
      >
        <button
          onClick={() => navigate("/")}
          className="group relative flex justify-center text-(--text-orange) bg-(--bg) border border-orange-300 p-1 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
          </svg>
          <p className="text-xs absolute translate-y-full m-2 -left-4 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Back Home
          </p>
        </button>
        {windowWidth > 600 && (
          <div className="flex flex-col justify-center items-start">
            <p className="text-(--text-orange) whitespace-nowrap">
              {time.toDateString()}
            </p>
            <p className="text-(--text-orange) whitespace-nowrap">
              {time.toLocaleTimeString()}
            </p>
          </div>
        )}
        <header className="flex items-center justify-center bg-(--bg2) px-2 py-1 rounded-full">
          <div
            className={`${windowWidth > 1275 ? "text-2xl" : windowWidth > 800 ? "text-xl" : "text-lg"} text-black font-bold`}
          >
            EXP.Cacl
          </div>
        </header>
      </div>

      <div
        className={`flex ${windowWidth > 600 ? "gap-4" : "gap-2"} items-center justify-between`}
      >
        {/* Dark/Light Mode */}
        <span className="flex-1">
          {theme === "light" && (
            <button
              onClick={changeTheme}
              className={`group relative flex flex-col items-center text-(--text) whitespace-nowrap hover:text-(--text-orange)
                            ${windowWidth > 1275 ? "text-xs" : "text-[11px]"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={windowWidth > 1275 ? "24px" : "20px"}
                viewBox="0 -960 960 960"
                width={windowWidth > 1275 ? "24px" : "20px"}
                fill="currentColor"
              >
                <path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z" />
              </svg>
              <p>Light Mode</p>
              <p className="text-xs absolute top-10 m-2 -right-6 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Light Mode: On
              </p>
            </button>
          )}
          {theme === "dark" && (
            <button
              onClick={changeTheme}
              className={`group relative flex flex-col items-center text-xs text-(--text) whitespace-nowrap hover:text-(--text-orange) transition-colors duration-200
                            ${windowWidth > 1275 ? "text-xs" : "text-[11px]"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={windowWidth > 1275 ? "24px" : "20px"}
                viewBox="0 -960 960 960"
                width={windowWidth > 1275 ? "24px" : "20px"}
                fill="currentColor"
              >
                <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z" />
              </svg>
              <p>Dark Mode</p>
              <p className="text-xs absolute top-10 m-2 -right-6 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Dark Mode: On
              </p>
            </button>
          )}
        </span>
        {isLoggedIn ? (
          <div className="flex-1 flex gap-2 items-center justify-end text-(--text)">
            <div className="flex gap-2 items-center text-lg bg-(--bg) border border-(--border) px-2 py-1 rounded-lg text-(--text)">
              {windowWidth > 750 && (
                <button
                  onClick={
                    windowWidth > 1275
                      ? () => {
                          if (isOpenProfile) {
                            closePanels();
                            return;
                          }
                          openProfile();
                        }
                      : () => navigate("/profile")
                  }
                  className="group relative flex justify-center bg-(--bg) pr-2 border-r border-(--border)"
                >
                  {profileImage ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-(--border)">
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height={windowWidth > 750 ? "32px" : "26px"}
                      viewBox="0 -960 960 960"
                      width={windowWidth > 750 ? "32px" : "26px"}
                      fill="currentColor"
                    >
                      <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z" />
                    </svg>
                  )} 
                  <p className="text-xs absolute top-10 -right-6 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Go to Profile
                  </p>
                </button>
              )}

              <p
                className={`whitespace-nowrap ${windowWidth > 1275 ? "text-md" : "text-sm"}`}
              >
                Account: {loggedInUser.username}
              </p>
            </div>
            {windowWidth > 750 ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => Logout()}
                  className="flex group relative text-(--text) hover:text-red-500 bg-(--bg) border border-(--border) p-1 rounded-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    fill="currentColor"
                  >
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                  </svg>
                  <p className="text-xs absolute top-10 -right-2 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Log Out
                  </p>
                </button>
                <button
                  onClick={
                    windowWidth > 1275
                      ? () => {
                          if (isOpenConversion) {
                            closePanels();
                            return;
                          }
                          openConversion();
                        }
                      : () => navigate("/currency_conversion")
                  }
                  className="group relative flex justify-center text-(--text-orange) bg-(--bg) border border-orange-300 p-1.5 rounded-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                  >
                    <path d="M480-40q-112 0-206-51T120-227v107H40v-240h240v80h-99q48 72 126.5 116T480-120q75 0 140.5-28.5t114-77q48.5-48.5 77-114T840-480h80q0 91-34.5 171T791-169q-60 60-140 94.5T480-40Zm-36-160v-52q-47-11-76.5-40.5T324-370l66-26q12 41 37.5 61.5T486-314q33 0 56.5-15.5T566-378q0-29-24.5-47T454-466q-59-21-86.5-50T340-592q0-41 28.5-74.5T446-710v-50h70v50q36 3 65.5 29t40.5 61l-64 26q-8-23-26-38.5T482-648q-35 0-53.5 15T410-592q0 26 23 41t83 35q72 26 96 61t24 77q0 29-10 51t-26.5 37.5Q583-274 561-264.5T514-250v50h-70ZM40-480q0-91 34.5-171T169-791q60-60 140-94.5T480-920q112 0 206 51t154 136v-107h80v240H680v-80h99q-48-72-126.5-116T480-840q-75 0-140.5 28.5t-114 77q-48.5 48.5-77 114T120-480H40Z" />
                  </svg>
                  <p className="text-xs absolute top-10 -right-2 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Currency Conversion
                  </p>
                </button>
              </div>
            ) : (
              <button onClick={() => setDropdown(!dropdown)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 flex gap-1 border-b border-(--bg2)/60 pb-0.5">
              <button
                onClick={() => navigate("/login")}
                className={`flex-1  hover:bg-(--text-orange)/70 flex flex-col items-center justify-center text-(--text) transition-all duration-400
                                        ${windowWidth > 1275 ? "text-sm px-2 py-1 rounded-2xl" : "text-[11px] p-1 rounded-xl"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height={windowWidth > 1275 ? "24px" : "20px"}
                  viewBox="0 -960 960 960"
                  width={windowWidth > 1275 ? "24px" : "20px"}
                  fill="currentColor"
                >
                  <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                </svg>
                <p>Login</p>
              </button>
              <button
                onClick={() => navigate("/register")}
                className={`flex-1 hover:bg-(--text-orange)/70 flex flex-col items-center justify-center text-(--text) transition-all duration-400
                                        ${windowWidth > 1275 ? "text-sm p-2 rounded-2xl" : "text-[11px] p-1 rounded-xl"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height={windowWidth > 1275 ? "24px" : "20px"}
                  viewBox="0 -960 960 960"
                  width={windowWidth > 1275 ? "24px" : "20px"}
                  fill="currentColor"
                >
                  <path d="M183.5-183.5Q160-207 160-240t23.5-56.5Q207-320 240-320t56.5 23.5Q320-273 320-240t-23.5 56.5Q273-160 240-160t-56.5-23.5Zm0-240Q160-447 160-480t23.5-56.5Q207-560 240-560t56.5 23.5Q320-513 320-480t-23.5 56.5Q273-400 240-400t-56.5-23.5Zm0-240Q160-687 160-720t23.5-56.5Q207-800 240-800t56.5 23.5Q320-753 320-720t-23.5 56.5Q273-640 240-640t-56.5-23.5Zm240 0Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Zm240 0Q640-687 640-720t23.5-56.5Q687-800 720-800t56.5 23.5Q800-753 800-720t-23.5 56.5Q753-640 720-640t-56.5-23.5Zm-240 240Q400-447 400-480t23.5-56.5Q447-560 480-560t56.5 23.5Q560-513 560-480t-23.5 56.5Q513-400 480-400t-56.5-23.5ZM520-160v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
                </svg>
                <p>Register</p>
              </button>
            </div>
            <button
              onClick={
                windowWidth > 1275
                  ? 
                    () => {
                      if (isOpenConversion) {
                        closePanels();
                        return;
                      }
                      openConversion();
                    }
                  : () => navigate("/currency_conversion")
              }
              className="group relative flex justify-center text-(--text-orange) bg-(--bg) border border-orange-300 p-1.5 rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={windowWidth > 1275 ? "24px" : "20px"}
                viewBox="0 -960 960 960"
                width={windowWidth > 1275 ? "24px" : "20px"}
                fill="currentColor"
              >
                <path d="M480-40q-112 0-206-51T120-227v107H40v-240h240v80h-99q48 72 126.5 116T480-120q75 0 140.5-28.5t114-77q48.5-48.5 77-114T840-480h80q0 91-34.5 171T791-169q-60 60-140 94.5T480-40Zm-36-160v-52q-47-11-76.5-40.5T324-370l66-26q12 41 37.5 61.5T486-314q33 0 56.5-15.5T566-378q0-29-24.5-47T454-466q-59-21-86.5-50T340-592q0-41 28.5-74.5T446-710v-50h70v50q36 3 65.5 29t40.5 61l-64 26q-8-23-26-38.5T482-648q-35 0-53.5 15T410-592q0 26 23 41t83 35q72 26 96 61t24 77q0 29-10 51t-26.5 37.5Q583-274 561-264.5T514-250v50h-70ZM40-480q0-91 34.5-171T169-791q60-60 140-94.5T480-920q112 0 206 51t154 136v-107h80v240H680v-80h99q-48-72-126.5-116T480-840q-75 0-140.5 28.5t-114 77q-48.5 48.5-77 114T120-480H40Z" />
              </svg>
              <p className="text-xs absolute top-10 -right-2 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Currency Conversion
              </p>
            </button>
          </div>
        )}
      </div>
      {windowWidth <= 750 && (
        <div
          className={`bg-(--code-bg) border border-(--border) rounded-md absolute right-0 top-12 text-(--text) mx-3 p-0.5
                    transition-all duration-150 ease-in-out origin-top-right z-100
                    ${
                      dropdown
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
        >
          <button
            onClick={() => {
              navigate("/currency_conversion");
              setDropdown(false);
            }}
            className="group relative flex justify-center p-1 text-orange-500 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M480-40q-112 0-206-51T120-227v107H40v-240h240v80h-99q48 72 126.5 116T480-120q75 0 140.5-28.5t114-77q48.5-48.5 77-114T840-480h80q0 91-34.5 171T791-169q-60 60-140 94.5T480-40Zm-36-160v-52q-47-11-76.5-40.5T324-370l66-26q12 41 37.5 61.5T486-314q33 0 56.5-15.5T566-378q0-29-24.5-47T454-466q-59-21-86.5-50T340-592q0-41 28.5-74.5T446-710v-50h70v50q36 3 65.5 29t40.5 61l-64 26q-8-23-26-38.5T482-648q-35 0-53.5 15T410-592q0 26 23 41t83 35q72 26 96 61t24 77q0 29-10 51t-26.5 37.5Q583-274 561-264.5T514-250v50h-70ZM40-480q0-91 34.5-171T169-791q60-60 140-94.5T480-920q112 0 206 51t154 136v-107h80v240H680v-80h99q-48-72-126.5-116T480-840q-75 0-140.5 28.5t-114 77q-48.5 48.5-77 114T120-480H40Z" />
            </svg>
            <p className="absolute right-12 ml-2 top-1/2 -translate-y-1/2 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Currency Conversion
            </p>
          </button>
          <hr />
          <button
            onClick={() => {
              navigate("/profile");
              setDropdown(false);
            }}
            className="group relative flex justify-center p-1 text-sm text-blue-500"
          >
            {profileImage ? (
              <div className="w-6 h-6 rounded-full overflow-hidden border border-(--border)"> 
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z" />
              </svg>
            )} 
            <p className="absolute right-12 ml-2 top-1/2 -translate-y-1/2 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Go to Profile
            </p>
          </button>
          <hr />
          <button
            onClick={() => {
              Logout();
              setDropdown(false);
            }}
            className="group relative flex justify-center p-1 text-sm text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
            </svg>
            <p className="absolute right-12 ml-2 top-1/2 -translate-y-1/2 bg-(--code-bg) border border-(--border) rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Log Out
            </p>
          </button>
        </div>
      )}
    </header>
  );
}

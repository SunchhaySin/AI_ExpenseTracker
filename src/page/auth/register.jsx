import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import UseAppContext from "../../context";

export default function RegisterPage() {
  const { windowWidth } = UseAppContext();
  console.log(windowWidth);
  const [signupForm, setSignupForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const onSignupChange = (e) =>
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Error Message
  const [success, setSuccess] = useState(""); // Success Message

  async function register(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        "https://expensetrackerserver-agte.onrender.com/reg",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(signupForm),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      console.log(data);
      setIsLoading(false);
      setSuccess("Registration Successful");
      setSignupForm({
        email: "",
        username: "",
        password: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 flex flex-col items-center text-(--text)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height={windowWidth > 750 ? "28px" : "24px"}
          viewBox="0 -960 960 960"
          width={windowWidth > 750 ? "28px" : "24px"}
          fill="currentColor"
        >
          <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
        <p className="text-sm">Back</p>
      </button>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-5 bg-(--bg) rounded-2xl ${windowWidth > 750 ? "p-12" : windowWidth > 500 ? "p-10" : "p-6"}`}
      >
        <div className="flex-1 flex items-center gap-2 self-center text-(--text-orange)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height={windowWidth > 750 ? "32px" : "26px"}
            viewBox="0 -960 960 960"
            width={windowWidth > 750 ? "32px" : "26px"}
            fill="currentColor"
          >
            <path d="M609-389q-29-29-29-71t29-71q29-29 71-29t71 29q29 29 29 71t-29 71q-29 29-71 29t-71-29ZM480-160v-56q0-24 12.5-44.5T528-290q36-15 74.5-22.5T680-320q39 0 77.5 7.5T832-290q23 9 35.5 29.5T880-216v56H480ZM287-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm113-113ZM80-160v-112q0-34 17-62.5t47-43.5q60-30 124.5-46T400-440q35 0 70 6t70 14l-34 34-34 34q-18-5-36-6.5t-36-1.5q-58 0-113.5 14T180-306q-10 5-15 14t-5 20v32h240v80H80Zm320-80Zm56.5-343.5Q480-607 480-640t-23.5-56.5Q433-720 400-720t-56.5 23.5Q320-673 320-640t23.5 56.5Q367-560 400-560t56.5-23.5Z" />
          </svg>
          <p className={`${windowWidth > 1275 ? "text-xl" : windowWidth > 750 ? "text-lg" : "text-md" }`}>Account Registration</p>
        </div>
        <div className="flex-1 flex flex-col gap-4 items-center justify-center">
          <form
            className="flex flex-col gap-2"
            onSubmit={register}
            id="registerForm"
          >
            <input
              name="email"
              placeholder="Email"
              type="email"
              className={`bg-(--code-bg) border border-(--border) ${windowWidth > 750 ? "w-100" : windowWidth > 389 ? "w-80" : "w-65"} p-2 rounded-lg text-(--text-orange) ${windowWidth > 750 ? "text-md" : "text-sm"}`}
              value={signupForm.email}
              onChange={onSignupChange}
            />
            <input
              name="username"
              placeholder="Username"
              type="text"
              className={`bg-(--code-bg) border border-(--border) ${windowWidth > 750 ? "w-100" : windowWidth > 389 ? "w-80" : "w-65"} p-2 rounded-lg text-(--text-orange) ${windowWidth > 750 ? "text-md" : "text-sm"}`}
              value={signupForm.username}
              onChange={onSignupChange}
            />
            <input
              name="password"
              placeholder="Password"
              type="password"
              className={`bg-(--code-bg) border border-(--border) ${windowWidth > 750 ? "w-100" : windowWidth > 389 ? "w-80" : "w-65"} p-2 rounded-lg text-(--text-orange) ${windowWidth > 750 ? "text-md" : "text-sm"}`}
              value={signupForm.password}
              onChange={onSignupChange}
            />
          </form>
          {error && (
            <span className="flex gap-2 items-center text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="M508.5-291.5Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5ZM440-440h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
              <p className="text-sm">{error}</p>
            </span>
          )}
          {success && (
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M160-80v-240q0-33 23.5-56.5T240-400h480q33 0 56.5 23.5T800-320v240H160Zm80-160h480v-80H240v80Zm240-160L280-680q0-83 58.5-141.5T480-880q83 0 141.5 58.5T680-680L480-400Zm0-112 120-168q0-50-35-85t-85-35q-50 0-85 35t-35 85l120 168Zm0-144Z" />
              </svg>
              <p className="text-sm">{success}</p>
            </span>
          )}
          <button
            className={`flex gap-2 justify-center items-center bg-(--bg2) p-2 ${windowWidth > 750 ? "w-100" : windowWidth > 389 ? "w-80" : "w-65"} rounded-lg text-(--text-d) text-lg mt-5 hover:bg-(--text-orange)`}
            type="submit"
            form="registerForm"
          >
            {isLoading ? (
              <div className="flex gap-2">
                <p>Loading</p>
                <div className="spinner-container">
                  <ClipLoader color="black" size={20} />
                </div>
              </div>
            ) : (
              <p className={`${windowWidth > 750 ? "text-md" : "text-sm"}`}>Register</p>
            )}
            {!isLoading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={windowWidth > 750 ? "24px" : "20px"}
                viewBox="0 -960 960 960"
                width={windowWidth > 750 ? "24px" : "20px"}
                fill="black"
              >
                <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

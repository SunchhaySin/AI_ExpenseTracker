import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import UseAppContext from '../../context';

export default function LoginPage() {
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    })
    const { setLoggedInUser } = UseAppContext();
    const navigate = useNavigate();
    const onChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(""); // Error Message
    const [success, setSuccess] = useState(""); // Success Message
    const [redirect, setRedirect] = useState(false); // Redirects user to dashboard after successful login

    async function userLogin(e) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('https://expensetrackerserver-agte.onrender.com/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(loginForm)
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error)
                setIsLoading(false);
                return;
            }
            console.log(data)
            setError(null)
            setLoggedInUser({
                userID: data.userID,
                username: data.username,
                email: data.email,
            })

            setSuccess("Login Sucessful")
            redirectUser();
            setLoginForm({
                email: "",
                password: "",
            })

        } catch (err) {
            console.error(err)
            setError(err.message);
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    const redirectUser = () => {
        if (redirect) return;
        setRedirect(true);
        setTimeout(() => {
            navigate("/dashboard");
        }, 1000);
    }  

    return (
        <div>
            <button 
                onClick={() => navigate(-1)}
                className="absolute top-5 left-5 flex flex-col items-center text-(--text)">
                <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="currentColor"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
                <p className="text-sm">Back</p>
            </button>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-5 bg-(--bg) rounded-2xl p-10">
                <div className="flex-1 flex items-center gap-2 self-center text-(--text-orange)">
                    <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="currentColor"><path d="M200-246q54-53 125.5-83.5T480-360q83 0 154.5 30.5T760-246v-514H200v514Zm379-235q41-41 41-99t-41-99q-41-41-99-41t-99 41q-41 41-41 99t41 99q41 41 99 41t99-41ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm69-80h422q-44-39-99.5-59.5T480-280q-56 0-112.5 20.5T269-200Zm168.5-337.5Q420-555 420-580t17.5-42.5Q455-640 480-640t42.5 17.5Q540-605 540-580t-17.5 42.5Q505-520 480-520t-42.5-17.5ZM480-503Z"/></svg>
                    <p className="text-xl">Account Login</p>
                </div>
                <div className="flex-1 flex flex-col gap-4 items-center justify-center">
                    <form className="flex flex-col gap-2" onSubmit={userLogin} id="loginForm">
                        <input
                            name="email"
                            placeholder="Email"
                            type="text"
                            className="bg-(--code-bg) border border-(--border) w-80 p-2 rounded-lg text-(--text-orange)"
                            value={loginForm.email}
                            onChange={onChange}
                        />
                        <input
                            name="password"
                            placeholder="Password"
                            type="password"
                            className="bg-(--code-bg) border border-(--border) w-80 p-2 rounded-lg text-(--text-orange)"
                            value={loginForm.password}
                            onChange={onChange}
                        />
                    </form>
                    {error &&
                        <span className="flex gap-2 items-center text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M508.5-291.5Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5ZM440-440h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                            <p className="text-sm">{error}</p>
                        </span>
                    }
                    {success && 
                        <span className="flex gap-2 items-center text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M160-80v-240q0-33 23.5-56.5T240-400h480q33 0 56.5 23.5T800-320v240H160Zm80-160h480v-80H240v80Zm240-160L280-680q0-83 58.5-141.5T480-880q83 0 141.5 58.5T680-680L480-400Zm0-112 120-168q0-50-35-85t-85-35q-50 0-85 35t-35 85l120 168Zm0-144Z"/></svg>
                            <p className="text-sm">{success}</p>
                        </span>
                    }
                    {redirect && 
                        <span className="flex items-center gap-2 text-(--text-orange)/70">
                            <p>Redirecting...</p>
                            <ClipLoader color="currentColor" size={20} />
                        </span>
                    }
                    <button className="flex gap-2 justify-center items-center bg-(--bg2) p-2 w-80 rounded-lg text-(--text-d) text-lg mt-5 hover:bg-(--text-orange)"
                        type="submit"
                        form="loginForm">
                        {isLoading
                            ? <div className="flex gap-2">
                                <p>Loading</p>
                                <div className="spinner-container">
                                    <ClipLoader color="black" size={20} />
                                </div>
                            </div>
                            : <p>Login</p>
                        }
                        {!isLoading && <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg>}
                    </button>
                </div>
            </div>
        </div>
    )
}

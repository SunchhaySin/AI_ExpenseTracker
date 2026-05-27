import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile({ loggedInUser }) {
    const user = loggedInUser;
    const navigate = useNavigate();
    const goToDashboard = () => {
        navigate('/')  
    }
    const [editProfile, setEditProfile] = useState(false);
    const onEditBtn = () => {
        setEditProfile(!editProfile)
    }
    return (
        <div className="flex flex-col bg-(--bg) place-items-center">
            <header className="flex items-center justify-between bg-(--bg2) w-11/12 m-3 p-1 rounded-full">
                <div className="">placeholder</div>
                <div className="text-2xl text-(--text-l) font-bold">AI-Powered Expense Tracker</div>
                <button className="bg-white text-(--text-d) rounded-full p-2">Login</button>
            </header>
            <div className="flex items-center gap-3 self-start ml-10 mt-15" onClick={goToDashboard}>
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#E3E3E3"><path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"/></svg>
                <p className="text-(--text-green) text-lg">Profile</p>
            </div>
            <p className="self-start ml-20 text-(--sub-text-green) text-sm">Your Personal Profile & Information</p>
            <div className="w-40 h-40 rounded-full bg-(--code-bg) text-(--text-l)">Not Set</div>
            <ul className="mt-10 flex flex-col gap-2">
                <li className="grid grid-cols-2 items-center gap-15 bg-(--bg-green) px-15 py-2 rounded-lg">
                    <p className="text-(--text-orange) text-lg p-2 rounded-lg">Email</p>
                    <input defaultValue={user?.email || "Info Not Available"} 
                        className="bg-(--code-bg) p-2 text-center text-(--text) rounded-lg" />
                </li>
                <li className="grid grid-cols-2 items-center gap-15 bg-(--bg-green) px-15 py-2 rounded-lg">
                    <p className="text-(--text-orange) text-lg p-2 rounded-lg">Username</p>
                    <input defaultValue={user?.username || "Info Not Available"} 
                        className="bg-(--code-bg) p-2 text-center text-(--text) rounded-lg" />
                </li>
                <li className="grid grid-cols-2 items-center gap-15 bg-(--bg-green) px-15 py-2 rounded-lg">
                    <p className="text-(--text-orange) text-lg p-2 rounded-lg">Password</p>
                    <input defaultValue={user?.username || "Info Not Available"} 
                        className="bg-(--code-bg) p-2 text-center text-(--text) rounded-lg" />
                </li>
                <li className="grid grid-cols-2 items-center gap-15 bg-(--bg-green) px-15 py-2 rounded-lg">
                    <p className="text-(--text-orange) text-lg p-2 rounded-lg">Profile Avatar</p>
                    <button onClick={onEditBtn} className="bg-(--bg2) text-(--text-d) p-2 rounded-lg hover:bg-(--text-orange)">Set Profile</button>
                </li>
            </ul>
            {editProfile && 
                <div className="flex mt-10 bg-(--bg2) p-2 gap-5 items-center rounded-lg">
                    <p className="font-semibold">Upload Picture:</p>
                    <input className="bg-(--code-bg) p-2 rounded-lg text-(--text-l)" />
                    <button className="bg-(--text-green) rounded-full p-1 text-(--text-d)">Confirm</button>
                </div>
            }
        </div>
    )
}

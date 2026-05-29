import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile({ loggedInUser }) {
    const user = loggedInUser;
    const navigate = useNavigate();
    const goToDashboard = () => {
        navigate('/')  
    }
    const [profile, setProfile] = useState(null);
    const [imgFile, setImageFile] = useState("");
    const [editProfile, setEditProfile] = useState(false);
    const fileInputRef = useRef(null);
    const onEditBtn = () => {
        setEditProfile(!editProfile)
    }

    const handleProfile = () => {
        // if(!loggedInUser.userID){
        //     alert("You're not Logged In")
        //     return;
        // }

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
    }

    const onFileChange = (e) => {
        const file = e.target.files[0]; 
        if (!file) return;
        setImageFile(file); 
    }

    const triggerFileDialog = () => {
        fileInputRef.current.click();
    };
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
            <div className="w-40 h-40 rounded-full bg-(--code-bg) text-(--text-l)">
                {profile ? <img 
                    src={profile}
                    height={200}
                    alt={"Profile Image"}
                    className="w-full h-full object-cover"
                />: "Profile Not Set"}
            </div>
            <ul className="mt-10 flex flex-col gap-2">
                <li className="grid grid-cols-2 items-center gap-15 bg-(--bg-green) px-15 py-2 rounded-lg">
                    <p className="text-(--text-orange) text-lg p-2 rounded-lg">Email</p>
                    <input value={user?.email || "Info Not Available"}
                        readOnly={true} 
                        className="bg-(--code-bg) p-2 text-center text-(--text) rounded-lg" />
                </li>
                <li className="grid grid-cols-2 items-center gap-15 bg-(--bg-green) px-15 py-2 rounded-lg">
                    <p className="text-(--text-orange) text-lg p-2 rounded-lg">Username</p>
                    <input value={user?.username || "Info Not Available"} 
                        readOnly={true}
                        className="bg-(--code-bg) p-2 text-center text-(--text) rounded-lg" />
                </li>
                <li className="grid grid-cols-2 items-center gap-15 bg-(--bg-green) px-15 py-2 rounded-lg">
                    <p className="text-(--text-orange) text-lg p-2 rounded-lg">Password</p>
                    <input value={user?.username || "Info Not Available"} 
                        readOnly={true}
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
                    <input type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={onFileChange}
                        accept=".jpg,.png,"
                    />  
                    <input 
                        value={imgFile ? "Profile Image Set" : "Choose a profile picture"} 
                        readOnly={true}
                        className="bg-(--code-bg) p-2 rounded-lg text-(--text-l)" />
                    <svg onClick={triggerFileDialog}
                        xmlns="http://www.w3.org/2000/svg" 
                        height="24px" 
                        viewBox="0 -960 960 960" 
                        width="24px" fill="#E3E3E3">
                            <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/>
                    </svg>
                    <button onClick={handleProfile}
                        className="bg-(--text-green) rounded-full p-1 text-(--text-d)">Confirm</button>
                </div>
            }
        </div>
    )
}

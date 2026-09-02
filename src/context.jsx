import { createContext, useContext, useState, useEffect } from "react";
import { getAuthHeader } from "./utils/token";

const AppContext = createContext(null);

export const API_BASE_URL = "https://expensetrackerserver-agte.onrender.com";

const fetchProfileImage = async (setProfileImage) => {
    try {
        const res = await fetch(`${API_BASE_URL}/profile/picture`, {
            headers: { ...getAuthHeader() },
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || "Failed to fetch profile image");
        }

        setProfileImage(data.profileImage);
    } catch (err) {
        console.error("Error fetching profile image:", err);
    }
};

export function ContextProvider({ children }) {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null); // Stores the profile image data fetched from the server

    const [windowWidth, setWindowWidth] = useState(0);
    const [allPaymentSlips, setAllPaymentSlips] = useState([]); // For authenticated users (uploaded slips are saved in database record)
    const [uploadedSlips, setUploadSlips] = useState([]); // For Unauthenticated users (uploads will disappear on refresh)
    const [isLoading, setIsLoading] = useState(false); // Stores the loading state of fetchUserUploads function

    // Conversin Panel and Profile Page are interchangeble on desktop displays
    const [isOpenConversion, setIsOpenConversion] = useState(false);
    const [isOpenProfile, setIsOpenProfile] = useState(false);

    const openConversion = () => {
        setIsOpenProfile(false);
        setIsOpenConversion(true);
    };
    const openProfile = () => {
        setIsOpenConversion(false);
        setIsOpenProfile(true);
    };
    const closePanels = () => {
        setIsOpenConversion(false);
        setIsOpenProfile(false);
    };

    useEffect(() => {
         const token = localStorage.getItem("token");
            if (!token) {
                setLoggedInUser(null);
                return;
            }

        fetch(`${API_BASE_URL}/auth/me`, {
            headers: { ...getAuthHeader()}
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Not logged in");
                return data;
            })
            .then(user => setLoggedInUser(user))
            .catch((err) => {
                console.error(err.message);
                setLoggedInUser(null)
            });
    }, []);

    useEffect(() => {
        if (!loggedInUser) return;

        const fetchUserUploads = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${API_BASE_URL}/fetch/upload`, {
                    headers: { ...getAuthHeader()}

                })

                if (!res.ok) throw new Error("Failed to fetch uploads");

                const data = await res.json();
                console.log(data.data)
                setAllPaymentSlips(data.data)

            } catch (err) {
                console.log(err)
            } finally {
                setIsLoading(false);
            }
        };

        if(loggedInUser) fetchUserUploads();
    }, [loggedInUser, setAllPaymentSlips]);

    // fetch user profile asychronously (onrefresh || onreload)
    useEffect(() => {
        if (!loggedInUser) return;
        const fetchProfileImage = async (setProfileImage) => {
            try {
                const res = await fetch(`${API_BASE_URL}/profile/picture`, {
                    headers: { ...getAuthHeader() },
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Failed to fetch profile image");
                }

                setProfileImage(data.profileImage);
            } catch (err) {
                console.error("Error fetching profile image:", err);
            }
        };
        if (loggedInUser) fetchProfileImage(setProfileImage);
    }, [loggedInUser]);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [theme, setTheme] = useState(() => {
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme) return currentTheme;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    })

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme); 
    }, [theme]);

    const changeTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <AppContext.Provider
            value={{
                loggedInUser,
                setLoggedInUser,
                windowWidth,

                allPaymentSlips,
                setAllPaymentSlips,

                uploadedSlips,
                setUploadSlips,

                theme,
                changeTheme,
                isLoading,

                isOpenConversion,
                setIsOpenConversion,
                isOpenProfile,
                setIsOpenProfile,

                openConversion,
                openProfile,
                closePanels,

                API_BASE_URL,

                profileImage,
                setProfileImage,
                fetchProfilePicture: () => fetchProfileImage(setProfileImage),
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default function UseAppContext() {
    return useContext(AppContext)
}
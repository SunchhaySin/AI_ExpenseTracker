import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

export function ContextProvider({ children }) {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [windowWidth, setWindowWidth] = useState(0);
    const [allPaymentSlips, setAllPaymentSlips] = useState([]); // For authenticated users (uploaded slips are saved in database record)
    const [uploadedSlips, setUploadSlips] = useState([]); // For Unauthenticated users (uploads will disappear on refresh)
    const [isLoading, setIsLoading] = useState(false); // Stores the loading state of fetchUserUploads function
    const [isOpenConversion, setIsOpenConversion] = useState(false);

    useEffect(() => {
        fetch('https://expensetrackerserver-agte.onrender.com/auth/me', {
            credentials: 'include'
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
                const res = await fetch(`https://expensetrackerserver-agte.onrender.com/fetch/upload/${loggedInUser.userID}`)

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
    }, [loggedInUser]);

    const formatItems = (items) => items.map(item => ({
        ...item,
        date: new Date(item.date).toDateString()
    }));

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
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default function UseAppContext() {
    return useContext(AppContext)
}
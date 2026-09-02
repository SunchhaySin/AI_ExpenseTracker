import { ContextProvider } from "./context";
import UseAppContext from "./context";
import Sidebar from "./page/sideBar";
import Header from "./page/header";
import Dashboard from "./page/components/dashboard";
import Profile from "./page/components/profile";
import LoginPage from "./page/auth/login";
import RegisterPage from "./page/auth/register";
import CurrencyConversion from "./page/components/currencyConversion";
import {
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useRef } from "react";

export default function PageLayout() {
  return (
    <ContextProvider>
      <Routes>
        <Route element={<LayoutStructure />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/currency_conversion" element={<CurrencyConversion />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </ContextProvider>
  );
}

function LayoutStructure() {
  const {
    windowWidth,
    isOpenConversion,
    setIsOpenConversion,
    isOpenProfile,
    setIsOpenProfile,
  } = UseAppContext();

  const isDesktop = windowWidth >= 1275;
  const isMobile = windowWidth <= 750;
  const showSidebar = windowWidth > 750;
  const isNarrowSidebar = showSidebar && windowWidth < 1080;
  const isCompactDesktop = isDesktop && windowWidth < 1400;
  const showSidePanel = isDesktop && (isOpenConversion || isOpenProfile);

  const location = useLocation();
  const navigate = useNavigate();

  const gridCols = isMobile
    ? "" // no grid-cols needed, layout is flex now
    : showSidePanel
      ? isCompactDesktop
        ? "grid-cols-[1.2fr_3fr_1.2fr]"
        : "grid-cols-[1fr_3fr_1fr]"
      : isNarrowSidebar
        ? "grid-cols-[1.5fr_2.5fr_0fr]"
        : "grid-cols-[1fr_3fr_0fr]";

  const spacingClass =
    windowWidth < 600
      ? "gap-2 p-4"
      : windowWidth < 1000
        ? "gap-4 p-10"
        : !isDesktop
          ? "gap-6 p-16"
          : showSidePanel
            ? "gap-3 py-20 px-8"
            : "gap-10 p-20";

   const prevIsDesktop = useRef(isDesktop);

  // Transition INTO non-desktop: carry whichever panel was open into the URL
  useEffect(() => {
    const wasDesktop = prevIsDesktop.current;
    prevIsDesktop.current = isDesktop;

    if (!isDesktop && wasDesktop) {
      if (isOpenProfile) {
        navigate("/profile", { replace: true });
      } else if (isOpenConversion) {
        navigate("/currency_conversion", { replace: true });
      }
    }
  }, [isDesktop, isOpenProfile, isOpenConversion, navigate]);

  // While non-desktop: keep panel state synced to whatever route the user is on
  useEffect(() => {
    if (isDesktop) return;

    if (location.pathname === "/profile") {
      setIsOpenProfile(true);
      setIsOpenConversion(false);
    } else if (location.pathname === "/currency_conversion") {
      setIsOpenConversion(true);
      setIsOpenProfile(false);
    } else {
      setIsOpenProfile(false);
      setIsOpenConversion(false);
    }
  }, [isDesktop, location.pathname, setIsOpenProfile, setIsOpenConversion]);

  // Desktop: profile/conversion are side panels, not routes (sync route with UI)
  useEffect(() => {
    if (
      isDesktop &&
      (location.pathname === "/profile" ||
        location.pathname === "/currency_conversion")
    ) {
      navigate("/dashboard", { replace: true });
    }
  }, [isDesktop, location.pathname, navigate]);

  // Mobile: route drives panel state (so it stays consistent if anything reads it)
  useEffect(() => {
    if (!isMobile) return;

    if (location.pathname === "/profile") {
      setIsOpenProfile(true);
      setIsOpenConversion(false);
    } else if (location.pathname === "/currency_conversion") {
      setIsOpenConversion(true);
      setIsOpenProfile(false);
    } else {
      setIsOpenProfile(false);
      setIsOpenConversion(false);
    }
  }, [isMobile, location.pathname, setIsOpenProfile, setIsOpenConversion]);

  return (
    <div className="h-[100lvh] flex flex-col ">
      <Header />
      <div
        className={`flex-1 min-h-0 grid transition-[grid-template-columns] duration-400 ease-in-out ${gridCols} ${spacingClass}`}
      >
        {windowWidth > 750 && (
          <div className="min-w-0 h-full">
            <Sidebar />
          </div>
        )}
        {isDesktop ? <Dashboard /> : <Outlet />}

        {isDesktop && (
          <div
            className={`min-w-0 overflow-hidden transition-opacity duration-300 ${showSidePanel ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            {isOpenProfile ? <Profile /> : <CurrencyConversion />}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/usercontext";
import { Notifications, Menu, Logout as LogoutIcon } from "@mui/icons-material";
// We derive profile image directly from authenticated user to avoid cross-user cache
import logo from "../assets/logo.png"; // Adjust the path as necessary

function Navbar() {
  const navigate = useNavigate();
  const { user, userType, isAuthenticated, logout } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const placeholder = "https://via.placeholder.com/120";
  const imgSrc = user?.profilePic || placeholder;
  const handleImgError = (e) => {
    if (e?.target) e.target.src = placeholder;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="relative grid grid-cols-[auto_1fr_auto] w-full items-center bg-transparent px-4 py-3 gap-3">
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Logo"
          className="h-10 w-10 object-cover rounded-full"
        />
        <h1 className="hidden lg:block text-xl font-bold text-gray-800">
          ArtHive
        </h1>
      </div>

      {isAuthenticated && user?.name && (
        <div className="justify-self-center text-center px-2 sm:px-4 min-w-0 overflow-hidden">
          <span className="font-bold text-white text-base sm:text-lg inline-block truncate max-w-full">
            {user.name}
          </span>
        </div>
      )}

      {/* Right */}
      <div className="hidden sm:flex items-center gap-3 justify-self-end whitespace-nowrap min-w-max">
        {isAuthenticated && userType === "seller" && (
          <button
            onClick={() => navigate("/Create")}
            className="shrink-0 bg-yellow-400 text-black px-4 py-2 rounded-full font-medium hover:bg-yellow-300 transition"
          >
            Post Your Art
          </button>
        )}

        {isAuthenticated ? (
          <>
            {userType === "buyer" && (
              <button
                onClick={() => navigate("/Notifications")}
                className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition"
              >
                <Notifications className="text-gray-800" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                title="Logout"
                className="hidden lg:inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold shadow-md hover:from-red-600 hover:to-rose-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-1 transition-transform duration-150 active:scale-95"
              >
                Logout
              </button>
            </div>
            <div className="relative">
              <img
                onClick={() => navigate("/Profile")}
                src={imgSrc}
                onError={handleImgError}
                alt="Profile"
                className="h-10 w-10 rounded-full border border-gray-300 object-cover cursor-pointer"
              />
              <button
                onClick={handleLogout}
                title="Logout"
                className="lg:hidden absolute -bottom-1 -right-1 p-1 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white shadow focus:outline-none focus:ring-1 focus:ring-rose-300"
              >
                <LogoutIcon fontSize="small" />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate("/Signup")}
            className="px-8 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
          >
            Create Seller Account
          </button>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="sm:hidden absolute right-3 top-3 p-2 rounded-md hover:bg-gray-200"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Open menu"
      >
        <Menu />
      </button>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="absolute right-4 top-14 z-30 sm:hidden bg-white rounded-xl shadow-xl border border-gray-200 w-[72vw] max-w-xs p-3">
          <div className="flex flex-col gap-2">
            {isAuthenticated && userType === "seller" && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/Create");
                }}
                className="w-full px-4 py-2 rounded-lg bg-yellow-400 text-black font-medium"
              >
                Post Your Art
              </button>
            )}

            {isAuthenticated ? (
              <>
                {userType === "buyer" && (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/Notifications");
                    }}
                    className="w-full px-4 py-2 rounded-lg hover:bg-gray-100 text-left"
                  >
                    Notifications
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/Profile");
                  }}
                  className="w-full px-4 py-2 rounded-lg hover:bg-gray-100 text-left"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/Signup");
                }}
                className="w-full px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold"
              >
                Create Seller Account
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

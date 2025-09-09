import React, { useState, useEffect, useRef } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPencilAlt,
} from "react-icons/fa";
import Navbar from "../Components/Navbar";
import AnimatedBackground from "../Components/AnimatedBackground";
import Education from "./education";
import Skill from "./Skill";
import Contact from "./Contact";
import { useUser } from "../Context/usercontext";
import { artworkAPI, userAPI } from "../services/api";

const BACKEND_URL = "http://localhost:5000";

function getImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return BACKEND_URL + imageUrl;
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Portfolio");
  const tabs = ["Portfolio", "Education", "Skills", "Contact"];
  const { user, updateUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "Your Name");
  const [headline, setHeadline] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const fileInputRef = useRef(null);

  // Use user.id or user._id, whichever is available
  const currentUserId = user?.id || user?._id;

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  // Load user profile data from backend
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!currentUserId) return;
      try {
        const response = await userAPI.getProfile(currentUserId);
        const userData = response.data;

        if (userData.headline) {
          setHeadline(userData.headline);
        }

        if (userData.profilePic) {
          updateUser({ ...user, profilePic: userData.profilePic });
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };

    loadUserProfile();
  }, [currentUserId]);

  const saveProfileToBackend = async (profileData) => {
    if (!currentUserId) return;
    try {
      await userAPI.updateProfile(currentUserId, profileData);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUserId) return;
    try {
      const form = new FormData();
      form.append("profilePic", file);
      const res = await userAPI.updateProfile(currentUserId, form);
      if (res?.data?.profilePic) {
        updateUser({ ...user, profilePic: res.data.profilePic });
      }
    } catch (err) {
      console.error("Failed to upload profile pic", err);
    }
  };

  const handleSaveProfile = async () => {
    setEditing(false);

    if (user && name !== user.name) {
      updateUser({ ...user, name });
    }

    await saveProfileToBackend({ headline });
  };

  useEffect(() => {
    const fetchArtworks = async () => {
      if (!currentUserId) return;
      setLoading(true);
      try {
        const res = await artworkAPI.getAll({ artist: currentUserId });
        setArtworks(res.data);
      } catch (err) {
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, [currentUserId]);

  return (
    <div className="flex min-h-screen p-4 sm:p-6 lg:p-8 fixed inset-0">
      <AnimatedBackground />

      {/* Sidebar */}
      <div
        className="hidden md:block w-1/4 pr-6 lg:pr-8 border border-white/30 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md rounded-xl"
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 32px rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative w-28 h-28 mx-auto pt-4 mr-[75px]">
            <img
              src={
                user?.profilePic
                  ? getImageUrl(user.profilePic)
                  : "https://via.placeholder.com/120"
              }
              alt="profile"
              className="rounded-full w-28 h-28 object-cover text-white"
            />
            <button
              type="button"
              className="absolute bottom-2 right-3 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-600 focus:outline-none"
              onClick={() => fileInputRef.current.click()}
              title="Edit profile picture"
            >
              <FaPencilAlt size={16} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleProfilePicChange}
            />
          </div>
          <div className="flex flex-col items-center justify-center text-center mt-6 w-full">
            <div className="w-full flex flex-col items-start justify-center ml-8">
              {editing ? (
                <input
                  className="text-xl font-bold px-2 py-1 text-white bg-transparent border-none outline-none w-64 text-center"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  maxLength={32}
                  placeholder="Enter your name"
                />
              ) : (
                <h2 className="text-xl text-white font-bold w-full text-center drop-shadow-lg">
                  {name}
                </h2>
              )}
            </div>
            <div className="w-full flex flex-col items-start justify-center mt-1 ml-8">
              {editing ? (
                <textarea
                  className="text-sm px-2 py-1 text-white bg-transparent border-none outline-none w-72 text-center resize-none min-h-[40px] max-h-[120px]"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  maxLength={120}
                  placeholder="Write a short headline about yourself"
                />
              ) : (
                <p className="text-sm text-white w-full text-center drop-shadow">
                  {headline || "Click edit to add a bio"}
                </p>
              )}
            </div>
            <div className="flex flex-row items-center justify-end w-full">
              {!editing && (
                <button
                  className="text-gray-300 hover:text-yellow-400"
                  onClick={() => setEditing(true)}
                  title="Edit name and headline"
                >
                  <FaPencilAlt size={18} />
                </button>
              )}
              {editing && (
                <button
                  className="text-green-400 text-lg font-bold"
                  onClick={handleSaveProfile}
                  title="Save changes"
                >
                  Save
                </button>
              )}
            </div>
          </div>

          <button className="border px-4 py-2 mt-2 text-white hover:bg-white/10 transition-colors rounded-full">
            Message
          </button>

          {/* Nav Links */}
          <div className="mt-10 space-y-4">
            {tabs.map((tab) => (
              <p
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer text-white hover:text-yellow-400 transition-colors ${
                  activeTab === tab ? "text-yellow-400 font-bold" : ""
                }`}
              >
                {tab}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side Content */}
      <div
        className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md h-[calc(100vh-64px)] w-full md:w-3/4 border border-white/30 rounded-xl md:ml-2 overflow-hidden overflow-y-auto"
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 32px rgba(255, 255, 255, 0.1)",
        }}
      >
        <Navbar />
        {/* Mobile Tabs */}
        <div className="md:hidden sticky top-0 z-10 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md border-b border-white/10">
          <div className="flex overflow-x-auto gap-2 px-3 py-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-white/20 text-yellow-300 border border-yellow-400"
                    : "text-white/80 border border-white/20"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        {activeTab === "Portfolio" && (
          <>
            {/* Top Filters */}
            <div className="flex flex-wrap justify-end items-end mb-4 sm:mb-6 gap-2 sm:gap-4 px-3 sm:px-4">
              <button
                className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                  statusFilter === "ALL"
                    ? "bg-white/20 text-yellow-300 border-yellow-400"
                    : "text-white hover:bg-white/10"
                }`}
                onClick={() => setStatusFilter("ALL")}
              >
                ALL
              </button>
              <button
                className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                  statusFilter === "AVAILABLE"
                    ? "bg-white/20 text-yellow-300 border-yellow-400"
                    : "text-white hover:bg-white/10"
                }`}
                onClick={() => setStatusFilter("AVAILABLE")}
              >
                AVAILABLE
              </button>
              <button
                className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                  statusFilter === "SOLD"
                    ? "bg-white/20 text-yellow-300 border-yellow-400"
                    : "text-white hover:bg-white/10"
                }`}
                onClick={() => setStatusFilter("SOLD")}
              >
                SOLD
              </button>
            </div>

            {/* Art Masonry Gallery */}
            <div className="columns-1 md:columns-2 lg:columns-4 mx-4 sm:mx-6 mt-2 sm:mt-4">
              {loading ? (
                <div className="col-span-4 text-center text-white">
                  Loading...
                </div>
              ) : (
                (() => {
                  const filtered =
                    statusFilter === "ALL"
                      ? artworks
                      : artworks.filter((a) =>
                          statusFilter === "SOLD"
                            ? a.status?.toLowerCase() === "sold"
                            : a.status?.toLowerCase() === "available"
                        );
                  return filtered.length === 0 ? (
                    <div className="col-span-4 text-center text-white">
                      No artworks found.
                    </div>
                  ) : (
                    filtered.map((art) => (
                      <img
                        key={art._id}
                        src={getImageUrl(art.imageUrl)}
                        alt={art.title}
                        className="mb-3 sm:mb-4 w-full rounded-xl object-cover hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    ))
                  );
                })()
              )}
            </div>
          </>
        )}

        {activeTab === "Education" && (
          <Education userId={currentUserId} editable={true} />
        )}
        {activeTab === "Skills" && <Skill />}
        {activeTab === "Contact" && <Contact />}
      </div>
    </div>
  );
};

export default ProfilePage;

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ProfilePicContext = createContext();

export const ProfilePicProvider = ({ children }) => {
  // Determine current user id from localStorage (works regardless of provider order)
  const currentUserId = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.id || parsed?._id || null;
    } catch {
      return null;
    }
  }, []);

  // Load per-user profile pic; fallback to placeholder
  const initialPic = useMemo(() => {
    if (!currentUserId) return "https://via.placeholder.com/120";
    return (
      localStorage.getItem(`profilePic:${currentUserId}`) ||
      "https://via.placeholder.com/120"
    );
  }, [currentUserId]);

  const [profilePic, setProfilePic] = useState(initialPic);

  // When the logged-in user changes, refresh the in-memory profilePic
  useEffect(() => {
    const nextPic = currentUserId
      ? localStorage.getItem(`profilePic:${currentUserId}`) ||
        "https://via.placeholder.com/120"
      : "https://via.placeholder.com/120";
    setProfilePic(nextPic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  // Keep localStorage in sync
  const setAndStoreProfilePic = (pic) => {
    setProfilePic(pic);
    const key = currentUserId ? `profilePic:${currentUserId}` : null;
    if (key) {
      localStorage.setItem(key, pic);
    }
  };

  return (
    <ProfilePicContext.Provider
      value={{ profilePic, setProfilePic: setAndStoreProfilePic }}
    >
      {children}
    </ProfilePicContext.Provider>
  );
};

export const useProfilePic = () => useContext(ProfilePicContext);

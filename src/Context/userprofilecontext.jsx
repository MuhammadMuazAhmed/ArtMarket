import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./usercontext";
import { userAPI } from "../services/api";

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const { user } = useUser();
  
  // Profile data states
  const [profilePic, setProfilePic] = useState("");
  const [headline, setHeadline] = useState("");
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    linkedin: "",
    portfolio: "",
    whatsapp: "",
    instagram: "",
  });

  // Load user-specific profile data when user changes
  useEffect(() => {
    if (user?.id) {
      loadUserProfileData(user.id);
    } else {
      // Clear profile data when no user is logged in
      clearProfileData();
    }
  }, [user]);

  const loadUserProfileData = (userId) => {
    // Load from localStorage first (for immediate display)
    const userProfilePic = localStorage.getItem(`profilePic_${userId}`);
    const userHeadline = localStorage.getItem(`headline_${userId}`);
    const userEducation = localStorage.getItem(`education_${userId}`);
    const userSkills = localStorage.getItem(`skills_${userId}`);
    const userContact = localStorage.getItem(`contact_${userId}`);
    
    setProfilePic(userProfilePic || "");
    setHeadline(userHeadline || "");
    setEducation(userEducation ? JSON.parse(userEducation) : []);
    setSkills(userSkills ? JSON.parse(userSkills) : []);
    setContactInfo(userContact ? JSON.parse(userContact) : {
      email: "",
      linkedin: "",
      portfolio: "",
      whatsapp: "",
      instagram: "",
    });

    // Also try to fetch from backend (for data sync)
    fetchUserProfileFromBackend(userId);
  };

  const fetchUserProfileFromBackend = async (userId) => {
    try {
      const response = await userAPI.getProfile(userId);
      const userData = response.data;
      
      if (userData.profilePic) {
        setProfilePic(userData.profilePic);
        localStorage.setItem(`profilePic_${userId}`, userData.profilePic);
      }
      
      if (userData.headline) {
        setHeadline(userData.headline);
        localStorage.setItem(`headline_${userId}`, userData.headline);
      }
      
      if (userData.education) {
        setEducation(userData.education);
        localStorage.setItem(`education_${userId}`, JSON.stringify(userData.education));
      }
      
      if (userData.skills) {
        setSkills(userData.skills);
        localStorage.setItem(`skills_${userId}`, JSON.stringify(userData.skills));
      }
      
      if (userData.contactInfo) {
        setContactInfo(userData.contactInfo);
        localStorage.setItem(`contact_${userId}`, JSON.stringify(userData.contactInfo));
      }
    } catch (error) {
      console.error("Failed to fetch user profile from backend:", error);
    }
  };

  const clearProfileData = () => {
    setProfilePic("");
    setHeadline("");
    setEducation([]);
    setSkills([]);
    setContactInfo({
      email: "",
      linkedin: "",
      portfolio: "",
      whatsapp: "",
      instagram: "",
    });
  };

  // Save functions with localStorage and backend sync
  const saveProfilePic = (pic) => {
    setProfilePic(pic);
    if (user?.id) {
      if (pic) {
        localStorage.setItem(`profilePic_${user.id}`, pic);
      } else {
        localStorage.removeItem(`profilePic_${user.id}`);
      }
      // Save to backend
      saveToBackend({ profilePic: pic });
    }
  };

  const saveHeadline = (newHeadline) => {
    setHeadline(newHeadline);
    if (user?.id) {
      if (newHeadline) {
        localStorage.setItem(`headline_${user.id}`, newHeadline);
      } else {
        localStorage.removeItem(`headline_${user.id}`);
      }
      // Save to backend
      saveToBackend({ headline: newHeadline });
    }
  };

  const saveEducation = (newEducation) => {
    setEducation(newEducation);
    if (user?.id) {
      localStorage.setItem(`education_${user.id}`, JSON.stringify(newEducation));
      // Save to backend
      saveToBackend({ education: newEducation });
    }
  };

  const saveSkills = (newSkills) => {
    setSkills(newSkills);
    if (user?.id) {
      localStorage.setItem(`skills_${user.id}`, JSON.stringify(newSkills));
      // Save to backend
      saveToBackend({ skills: newSkills });
    }
  };

  const saveContactInfo = (newContactInfo) => {
    setContactInfo(newContactInfo);
    if (user?.id) {
      localStorage.setItem(`contact_${user.id}`, JSON.stringify(newContactInfo));
      // Save to backend
      saveToBackend({ contactInfo: newContactInfo });
    }
  };

  const saveToBackend = async (data) => {
    if (!user?.id) return;
    
    try {
      await userAPI.updateProfile(user.id, data);
    } catch (error) {
      console.error("Failed to save profile data to backend:", error);
    }
  };

  // Clear user-specific data on logout
  const clearUserData = (userId) => {
    if (userId) {
      localStorage.removeItem(`profilePic_${userId}`);
      localStorage.removeItem(`headline_${userId}`);
      localStorage.removeItem(`education_${userId}`);
      localStorage.removeItem(`skills_${userId}`);
      localStorage.removeItem(`contact_${userId}`);
    }
  };

  const value = {
    // Data
    profilePic,
    headline,
    education,
    skills,
    contactInfo,
    
    // Setters
    setProfilePic: saveProfilePic,
    setHeadline: saveHeadline,
    setEducation: saveEducation,
    setSkills: saveSkills,
    setContactInfo: saveContactInfo,
    
    // Utilities
    clearUserData,
    loadUserProfileData,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);
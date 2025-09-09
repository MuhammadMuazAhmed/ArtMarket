import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Link } from "@mui/material";
import { MdEmail } from "react-icons/md";
import {
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
  FaGlobe,
  FaPencilAlt,
} from "react-icons/fa";
import { useUser } from "../Context/usercontext";
import { userAPI } from "../services/api";

const ContactPage = () => {
  const { user, updateUser } = useUser();
  const [contacts, setContacts] = useState({
    email: "",
    linkedin: "",
    portfolio: "",
    whatsapp: "",
    instagram: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUserId = user?.id || user?._id;

  // Fetch contacts from backend
  useEffect(() => {
    const fetchContacts = async () => {
      if (!currentUserId) return;

      try {
        setLoading(true);
        const response = await userAPI.getProfile(currentUserId);
        const backendContacts = response.data.contactInfo || {};
        setContacts({
          email: backendContacts.email || "",
          linkedin: backendContacts.linkedin || "",
          portfolio: backendContacts.portfolio || "",
          whatsapp: backendContacts.whatsapp || "",
          instagram: backendContacts.instagram || "",
        });
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [currentUserId]);

  const saveContactsToBackend = async (newContacts) => {
    if (!currentUserId) return;

    try {
      const res = await userAPI.updateProfile(currentUserId, { contactInfo: newContacts });
      if (res?.data) {
        updateUser(res.data); // update context + localStorage
      }
    } catch (error) {
      console.error("Failed to save contacts:", error);
    }
  };

  const handleSave = async (key, value) => {
    const newContacts = { ...contacts, [key]: value };
    setContacts(newContacts);
    await saveContactsToBackend(newContacts);
    setEditingIndex(null);
  };

  const contactItems = [
    {
      label: "Email",
      value: contacts.email || "",
      icon: <MdEmail size={30} className="text-blue-600" />,
      link: contacts.email ? `mailto:${contacts.email}` : "#",
      key: "email",
      placeholder: "Enter your email",
    },
    {
      label: "LinkedIn",
      value: contacts.linkedin || "",
      icon: <FaLinkedin size={30} className="text-blue-600" />,
      link: contacts.linkedin || "#",
      key: "linkedin",
      placeholder: "Enter your LinkedIn URL",
    },
    {
      label: "Portfolio",
      value: contacts.portfolio || "",
      icon: <FaGlobe size={30} className="text-blue-600" />,
      link: contacts.portfolio || "#",
      key: "portfolio",
      placeholder: "Enter your portfolio URL",
    },
    {
      label: "WhatsApp",
      value: contacts.whatsapp || "",
      icon: <FaWhatsapp size={30} className="text-green-600" />,
      link: contacts.whatsapp || "#",
      key: "whatsapp",
      placeholder: "Enter your WhatsApp link",
    },
    {
      label: "Instagram",
      value: contacts.instagram || "",
      icon: <FaInstagram size={30} className="text-pink-500" />,
      link: contacts.instagram || "#",
      key: "instagram",
      placeholder: "Enter your Instagram URL",
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-full p-4 overflow-y-auto">
        <Box className="max-w-3xl mx-auto p-6 rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md border border-white/30">
          <div className="text-center text-white">
            Loading contact information...
          </div>
        </Box>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <Box
        className="max-w-3xl mx-auto p-6 rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md border border-white/30"
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 32px rgba(255, 255, 255, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          className="text-white drop-shadow-lg"
        >
          Contact
        </Typography>

        {!currentUserId && Object.values(contacts).every((val) => !val) && (
          <div className="text-center py-8">
            <Typography className="text-white/60">
              No contact information available
            </Typography>
          </div>
        )}

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactItems.map((item, index) => (
            <Card
              key={index}
              className="flex items-center p-4 transition duration-300"
              sx={{
                backgroundColor: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: "0 8px 24px rgba(31,38,135,0.25)",
                borderRadius: 2,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.10)" },
              }}
            >
              <div className="mr-4">{item.icon}</div>
              <CardContent className="flex flex-col w-full">
                <div className="flex items-center justify-between w-full">
                  <Typography
                    variant="h6"
                    className="font-semibold mb-1 text-white drop-shadow-lg"
                  >
                    {item.label}
                  </Typography>
                  {currentUserId && (
                    <>
                      {editingIndex === index ? (
                        <button
                          className="text-green-500 ml-2 text-sm border px-2 py-1 rounded"
                          onClick={() => handleSave(item.key, editValue)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="text-white/70 hover:text-yellow-500 ml-2"
                          onClick={() => {
                            setEditingIndex(index);
                            setEditValue(item.value);
                          }}
                          title={`Edit ${item.label}`}
                        >
                          <FaPencilAlt size={16} />
                        </button>
                      )}
                    </>
                  )}
                </div>
                {editingIndex === index ? (
                  <div className="flex gap-2">
                    <input
                      className="mt-2 border-b border-white/30 bg-transparent text-white px-2 py-1 flex-1"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder={item.placeholder}
                      autoFocus
                    />
                    <button
                      className="text-red-400 hover:text-red-300 text-sm mt-2"
                      onClick={() => {
                        setEditingIndex(null);
                        setEditValue("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    {item.value ? (
                      <Link
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 hover:underline mt-1 block drop-shadow-lg"
                      >
                        {item.value}
                      </Link>
                    ) : (
                      <Typography className="text-white/50 mt-1 text-sm">
                        {currentUserId ? "Click edit to add" : "Not provided"}
                      </Typography>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default ContactPage;

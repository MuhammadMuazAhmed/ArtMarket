import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Box,
  Typography,
  Autocomplete,
} from "@mui/material";
import { countries } from "countries-list"; // Import countries list
import { useUser } from "../Context/usercontext";
import { userAPI } from "../services/api";

const degrees = ["Matric", "FSc", "BS", "MS", "PhD"];

const Education = ({ userId, editable }) => {
  const { user, updateEducation } = useUser();
  const allCountries = Object.values(countries).map((country) => country.name);
  const [educations, setEducations] = useState([]);
  const [educationData, setEducationData] = useState({
    country: "",
    university: "",
    degree: "",
    major: "",
    graduationYear: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use user.id or user._id, whichever is available
  const currentUserId = userId || user?.id || user?._id;
  const isEditable = editable && user && currentUserId;

  // Debug logging

  // Fetch education from backend
  useEffect(() => {
    const fetchEducation = async () => {
      if (!currentUserId) {
        return;
      }

      try {
        setLoading(true);
        const response = await userAPI.getProfile(currentUserId);
        setEducations(response.data.education || []);
      } catch (error) {
        console.error("Failed to fetch education:", error);
        setEducations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [currentUserId]);

  const handleChange = (field, value) => {
    setEducationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !educationData.country ||
      !educationData.university ||
      !educationData.degree ||
      !educationData.major ||
      !educationData.graduationYear
    )
      return;

    let newEducations;
    if (editIndex !== null) {
      newEducations = educations.map((ed, idx) =>
        idx === editIndex ? educationData : ed
      );
    } else {
      newEducations = [...educations, educationData];
    }

    setEducations(newEducations);

    if (isEditable && currentUserId) {
      try {
        await updateEducation(currentUserId, newEducations);
      } catch (error) {
        console.error("Failed to save education:", error);
      }
    }

    setEducationData({
      country: "",
      university: "",
      degree: "",
      major: "",
      graduationYear: "",
    });
    setShowForm(false);
    setEditIndex(null);
  };

  const handleEdit = (idx) => {
    setEducationData(educations[idx]);
    setShowForm(true);
    setEditIndex(idx);
  };

  const handleDelete = async (idx) => {
    const newEducations = educations.filter((_, index) => index !== idx);
    setEducations(newEducations);

    if (isEditable && currentUserId) {
      try {
        await updateEducation(currentUserId, newEducations);
      } catch (error) {
        console.error("Failed to delete education:", error);
      }
    }
  };

  if (loading) {
    return (
      <Box
        className="w-full h-full p-4 overflow-y-auto"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Box className="max-w-lg w-full space-y-6 p-6 rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md border border-white/30">
          <div className="text-center text-white">Loading education...</div>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      className="w-full h-full p-4 overflow-y-auto"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
    >
      <Box
        className="max-w-lg w-full space-y-6 p-6 rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md border border-white/30"
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
          Education
        </Typography>

        {/* Education List */}
        {educations.length > 0 && !showForm && (
          <Box className="mb-2 space-y-3">
            {educations.map((ed, idx) => (
              <Box
                key={idx}
                className="p-4 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      className="text-white drop-shadow-lg"
                    >
                      {ed.degree} in {ed.major} ({ed.graduationYear})
                    </Typography>
                    <Typography variant="body2" className="text-white/80">
                      {ed.university}, {ed.country}
                    </Typography>
                  </div>
                  {isEditable && (
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => handleEdit(idx)}
                        className="text-yellow-400 hover:text-yellow-300 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </Box>
            ))}
          </Box>
        )}

        {/* Show message when no education and not editable */}
        {educations.length === 0 && !isEditable && (
          <div className="text-center py-8">
            <Typography className="text-white/60">
              No education information available
            </Typography>
          </div>
        )}

        {/* Education Form */}
        {isEditable && (showForm || educations.length === 0) && (
          <>
            {/* Country Autocomplete */}
            <Autocomplete
              freeSolo
              options={allCountries}
              value={educationData.country}
              onChange={(e, newValue) => handleChange("country", newValue)}
              onInputChange={(e, newInputValue) =>
                handleChange("country", newInputValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="College/University Country"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(2px)",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#fbbf24",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                  fullWidth
                />
              )}
            />
            {/* University Name */}
            <TextField
              label="College/University Name"
              variant="outlined"
              fullWidth
              value={educationData.university}
              onChange={(e) => handleChange("university", e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(2px)",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fbbf24",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
              }}
            />
            {/* Degree + Major */}
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Degree
                </InputLabel>
                <Select
                  value={educationData.degree}
                  onChange={(e) => handleChange("degree", e.target.value)}
                  label="Degree"
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(2px)",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fbbf24",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "rgba(17, 24, 39, 0.95)",
                        color: "white",
                        backdropFilter: "blur(6px)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      },
                    },
                  }}
                >
                  {degrees.map((degree) => (
                    <MenuItem key={degree} value={degree}>
                      {degree}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Major"
                variant="outlined"
                fullWidth
                value={educationData.major}
                onChange={(e) => handleChange("major", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(2px)",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#fbbf24",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              />
            </Box>
            {/* Graduation Year */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Year of Graduation
              </InputLabel>
              <Select
                value={educationData.graduationYear}
                onChange={(e) => handleChange("graduationYear", e.target.value)}
                label="Year of Graduation"
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(2px)",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#fbbf24",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "white",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "rgba(17, 24, 39, 0.95)",
                      color: "white",
                      backdropFilter: "blur(6px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    },
                  },
                }}
              >
                {Array.from({ length: 40 }, (_, i) => 2025 - i).map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Submit Button */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#fbbf24",
                color: "black",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#f59e0b",
                },
                py: 1.25,
                boxShadow: "0 8px 24px rgba(251,191,36,0.35)",
                textTransform: "none",
                borderRadius: 2,
              }}
              onClick={handleSubmit}
              disabled={
                !educationData.country ||
                !educationData.university ||
                !educationData.degree ||
                !educationData.major ||
                !educationData.graduationYear
              }
            >
              {editIndex !== null ? "Save" : "Add"}
            </Button>

            {/* Cancel Button */}
            {showForm && educations.length > 0 && (
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  "&:hover": {
                    borderColor: "#fbbf24",
                    backgroundColor: "rgba(251, 191, 36, 0.08)",
                  },
                  textTransform: "none",
                  borderRadius: 2,
                }}
                onClick={() => {
                  setShowForm(false);
                  setEditIndex(null);
                  setEducationData({
                    country: "",
                    university: "",
                    degree: "",
                    major: "",
                    graduationYear: "",
                  });
                }}
              >
                Cancel
              </Button>
            )}
          </>
        )}

        {/* Add Education Button */}
        {isEditable && educations.length > 0 && !showForm && (
          <Button
            variant="outlined"
            fullWidth
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.4)",
              "&:hover": {
                borderColor: "#fbbf24",
                backgroundColor: "rgba(251, 191, 36, 0.08)",
              },
              textTransform: "none",
              borderRadius: 2,
            }}
            onClick={() => {
              setShowForm(true);
              setEducationData({
                country: "",
                university: "",
                degree: "",
                major: "",
                graduationYear: "",
              });
              setEditIndex(null);
            }}
          >
            Add Education
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Education;

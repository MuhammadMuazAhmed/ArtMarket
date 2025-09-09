import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Slider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useUser } from "../Context/usercontext";
import { userAPI } from "../services/api";

const Skill = () => {
  const { user } = useUser();
  const [skills, setSkills] = useState([]);
  const [skillData, setSkillData] = useState({
    name: "",
    description: "",
    efficiency: 50,
  });
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use user.id or user._id, whichever is available
  const currentUserId = user?.id || user?._id;

  // Fetch skills from backend when component mounts
  useEffect(() => {
    const fetchSkills = async () => {
      if (!currentUserId) {
        return;
      }

      try {
        setLoading(true);
        const response = await userAPI.getProfile(currentUserId);
        setSkills(response.data.skills || []);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [currentUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkillData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEfficiencyChange = (event, newValue) => {
    setSkillData((prev) => ({
      ...prev,
      efficiency: newValue,
    }));
  };

  const saveSkillsToBackend = async (newSkills) => {
    if (!currentUserId) {
      return;
    }

    try {
      await userAPI.updateSkills(currentUserId, newSkills);
    } catch (error) {
      console.error("Failed to save skills:", error);
    }
  };

  const handleSubmit = async () => {
    if (!skillData.name.trim()) return;

    let newSkills;
    if (editIndex !== null) {
      newSkills = skills.map((sk, idx) => (idx === editIndex ? skillData : sk));
    } else {
      newSkills = [...skills, skillData];
    }

    setSkills(newSkills);
    await saveSkillsToBackend(newSkills);

    setSkillData({ name: "", description: "", efficiency: 50 });
    setShowForm(false);
    setEditIndex(null);
  };

  const handleEdit = (idx) => {
    setSkillData(skills[idx]);
    setShowForm(true);
    setEditIndex(idx);
  };

  const handleDelete = async (idx) => {
    const newSkills = skills.filter((_, index) => index !== idx);
    setSkills(newSkills);
    await saveSkillsToBackend(newSkills);
  };

  if (loading) {
    return (
      <div className="w-full h-full p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md border border-white/30">
          <div className="text-center text-white">Loading skills...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <div
        className="max-w-2xl mx-auto p-6 rounded-xl bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md border border-white/30"
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 32px rgba(255, 255, 255, 0.1)",
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-lg">
          Skills
        </h2>

        {/* Skills List */}
        {skills.length > 0 && !showForm && (
          <div className="mb-6">
            <h3 className="font-semibold text-white/90 drop-shadow">
              Artist Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="rounded-lg p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-white font-medium drop-shadow">
                        {skill.name}
                      </div>
                      {skill.description && (
                        <div className="text-white/80 text-sm mt-1 leading-snug">
                          {skill.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-yellow-300 font-semibold whitespace-nowrap">
                        {skill.efficiency}%
                      </div>
                      {currentUserId && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                      style={{ width: `${skill.efficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show message when no skills and not logged in */}
        {skills.length === 0 && !currentUserId && (
          <div className="text-center py-8">
            <Typography className="text-white/60">
              No skills information available
            </Typography>
          </div>
        )}

        {/* Skill Form */}
        {currentUserId && (showForm || skills.length === 0) && (
          <Box
            component="form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            display="flex"
            flexDirection="column"
            gap={3}
            mb={2}
          >
            <TextField
              label="Skill Name"
              variant="filled"
              fullWidth
              name="name"
              value={skillData.name}
              onChange={handleChange}
              InputProps={{ disableUnderline: true }}
              sx={{
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiFilledInput-root": {
                  backgroundColor: "transparent",
                  "&:before, &:after": { borderBottom: "none" },
                },
              }}
            />

            <TextField
              label="Skill Description"
              variant="filled"
              fullWidth
              name="description"
              value={skillData.description}
              onChange={handleChange}
              multiline
              minRows={2}
              InputProps={{ disableUnderline: true }}
              sx={{
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiFilledInput-root": {
                  backgroundColor: "transparent",
                  "&:before, &:after": { borderBottom: "none" },
                },
              }}
            />

            <Box width="100%">
              <Typography gutterBottom className="text-white drop-shadow-lg">
                Efficiency
              </Typography>
              <Slider
                sx={{
                  color: "rgb(251, 191, 36)", // yellow-400
                  "& .MuiSlider-thumb": {
                    backgroundColor: "rgb(251, 191, 36)",
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "rgb(251, 191, 36)",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                  },
                }}
                value={skillData.efficiency}
                onChange={handleEfficiencyChange}
                aria-labelledby="efficiency-slider"
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                min={1}
                max={100}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!skillData.name.trim()}
              sx={{
                backgroundColor: "#fbbf24",
                color: "black",
                fontWeight: 600,
                py: 1.25,
                "&:hover": { backgroundColor: "#f59e0b" },
                boxShadow: "0 8px 24px rgba(251,191,36,0.35)",
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              {editIndex !== null ? "Save" : "Add"}
            </Button>

            {/* Cancel Button */}
            {showForm && skills.length > 0 && (
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "#fbbf24",
                    backgroundColor: "rgba(251,191,36,0.08)",
                  },
                  textTransform: "none",
                  borderRadius: 2,
                }}
                onClick={() => {
                  setShowForm(false);
                  setEditIndex(null);
                  setSkillData({ name: "", description: "", efficiency: 50 });
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        )}

        {/* Add Skill Button */}
        {currentUserId && skills.length > 0 && !showForm && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            fullWidth
            onClick={() => {
              setShowForm(true);
              setSkillData({ name: "", description: "", efficiency: 50 });
              setEditIndex(null);
            }}
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.5)",
              "&:hover": {
                borderColor: "#fbbf24",
                backgroundColor: "rgba(251,191,36,0.08)",
              },
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Add Skill
          </Button>
        )}
      </div>
    </div>
  );
};

export default Skill;

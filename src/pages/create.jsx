import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/usercontext";
import { artworkAPI } from "../services/api";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import AnimatedBackground from "../Components/AnimatedBackground";
import {
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFilter } from "../Context/filtercontext";

function Create() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const { filters, setFilters } = useFilter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is authenticated and is a seller
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen p-4 sm:p-6 lg:p-8 fixed inset-0">
        <AnimatedBackground />
        <Sidebar page="Post" />
        <div className="bg-black/20 backdrop-blur-sm w-full md:w-[calc(75%-32px)] border rounded-xl md:ml-[calc(25%+32px)] h-[calc(100vh-64px)] text-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl mb-4">
              Please login to create artwork
            </h2>
            <Button
              variant="contained"
              onClick={() => navigate("/Login")}
              sx={{ backgroundColor: "#fbbf24", color: "black" }}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== "seller") {
    return (
      <div className="flex h-screen p-4 sm:p-6 lg:p-8 fixed inset-0">
        <AnimatedBackground />
        <Sidebar page="Post" />
        <div className="bg-black/20 backdrop-blur-sm w-full md:w-[calc(75%-32px)] border rounded-xl md:ml-[calc(25%+32px)] h-[calc(100vh-64px)] text-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl mb-4">
              Only sellers can create artwork
            </h2>
            <p className="mb-4">
              Please update your account type to seller to create artwork.
            </p>
            <Button
              variant="contained"
              onClick={() => navigate("/Profile")}
              sx={{ backgroundColor: "#fbbf24", color: "black" }}
            >
              Go to Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
    setSuccess("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
      // Clear any previous errors
      setError("");
      setSuccess("");
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.category) {
      setError("Please select a category before submitting.");
      setLoading(false);
      return;
    }

    if (
      !filters.medium ||
      !filters.size ||
      !filters.style ||
      filters.style === "AllStyles" ||
      !filters.technique ||
      !filters.price
    ) {
      setError(
        "Please select all filters (medium, size, style, technique, price) before submitting. Avoid using 'AllStyles' for style."
      );
      setLoading(false);
      return;
    }

    if (!formData.title || !formData.title.trim()) {
      setError("Please provide a title for the artwork.");
      setLoading(false);
      return;
    }

    // Backend requires description to be at least 10 characters
    if (!formData.description || formData.description.trim().length < 10) {
      setError("Description must be at least 10 characters long.");
      setLoading(false);
      return;
    }

    const priceValue = parseFloat(filters.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Please select a valid price using the price range slider.");
      setLoading(false);
      return;
    }

    if (!selectedFile && !formData.imageUrl) {
      setError("Please upload an image or provide an image URL");
      setLoading(false);
      return;
    }

    try {
      // Create FormData object for file upload
      const artworkFormData = new FormData();
      artworkFormData.append("title", formData.title);
      artworkFormData.append("description", formData.description);
      artworkFormData.append("category", formData.category);

      artworkFormData.append("price", parseFloat(filters.price));

      // Include selected filters so they are saved on the artwork (only if set)
      const toTitleCase = (val) =>
        typeof val === "string"
          ? val
              .trim()
              .split(" ")
              .filter(Boolean)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ")
          : "";

      const normalizeSize = (val) => {
        const v = (val || "").toLowerCase();
        if (v.includes("small")) return "Small";
        if (v.includes("medium")) return "Medium";
        if (v.includes("large")) return "Large"; // map Extra Large to Large to satisfy backend
        return toTitleCase(val);
      };

      artworkFormData.append("medium", toTitleCase(filters.medium));
      artworkFormData.append("size", normalizeSize(filters.size));
      artworkFormData.append("style", toTitleCase(filters.style));
      artworkFormData.append("technique", toTitleCase(filters.technique));

      // If we have a file, append it, otherwise use the URL
      if (selectedFile) {
        artworkFormData.append("image", selectedFile);
      } else if (formData.imageUrl) {
        artworkFormData.append("imageUrl", formData.imageUrl);
      }

      await artworkAPI.create(artworkFormData);
      setSuccess("Artwork created successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        imageUrl: "",
      });
      // Reset sidebar filters after successful upload
      setFilters({ medium: "", size: "", style: "", technique: "", price: "" });
      setSelectedFile(null);
      setPreviewUrl("");

      // Redirect to home after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      const data = error.response?.data;
      let msg = data?.details
        ?.map?.((d) => `${d.field}: ${d.message}`)
        ?.join("; ");
      if (!msg) msg = data?.message || data?.error;
      setError(msg || "Failed to create artwork");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex fixed inset-0 p-4 sm:p-6 lg:p-8">
      <AnimatedBackground />
      <Sidebar page="Post" />
      <div
        className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md md:ml-[calc(25%+32px)] w-full md:w-[calc(75%-32px)] h-[calc(100vh-64px)] flex flex-col rounded-xl border border-white/20 overflow-hidden overflow-y-auto"
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 32px rgba(255, 255, 255, 0.1)",
        }}
      >
        <Navbar />
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <div
            className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 w-full border border-white/30"
            style={{
              boxShadow:
                "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 32px rgba(255, 255, 255, 0.1)",
            }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
              Create New Artwork
            </h1>
            {error && (
              <Alert severity="error" className="mb-4">
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" className="mb-4">
                {success}
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{
                    style: { color: "white" },
                    sx: {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.8)",
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  minRows={2}
                  InputLabelProps={{ style: { color: "white" } }}
                  InputProps={{
                    style: { color: "white" },
                    sx: {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.8)",
                      },
                    },
                  }}
                />
              </Box>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "white" }}>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                  required
                  sx={{
                    color: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.8)",
                    },
                  }}
                >
                  <MenuItem value="painting">Painting</MenuItem>
                  <MenuItem value="sculpture">Sculpture</MenuItem>
                  <MenuItem value="photography">Photography</MenuItem>
                  <MenuItem value="digital">Digital Art</MenuItem>
                  <MenuItem value="print">Print</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ color: "white", mb: 1 }}>
                  Upload Artwork Image
                </Typography>
                <div className="bg-black/10 border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleFileSelect}
                    sx={{
                      color: "white",
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      backgroundColor: "transparent",
                      "&:hover": {
                        borderColor: "#fbbf24",
                        backgroundColor: "rgba(251, 191, 36, 0.1)",
                      },
                      mb: 2,
                      width: "100%",
                      py: 1.5,
                    }}
                  >
                    {selectedFile ? "Change Image" : "Select Image"}
                  </Button>
                  {previewUrl && (
                    <Box sx={{ mt: 2, mb: 2, textAlign: "center" }}>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxWidth: "28rem",
                          maxHeight: "40vh",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  )}
                  <div className="flex items-center w-full my-2">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="mx-2 text-gray-300 text-sm">OR</span>
                    <div className="flex-1 h-px bg-gray-500" />
                  </div>
                  <TextField
                    fullWidth
                    label="Image URL"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    variant="outlined"
                    placeholder="https://example.com/image.jpg"
                    InputLabelProps={{ style: { color: "white" } }}
                    InputProps={{
                      style: { color: "white" },
                      sx: {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(255, 255, 255, 0.5)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(255, 255, 255, 0.8)",
                        },
                      },
                    }}
                  />
                </div>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: "#fbbf24",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#f59e0b",
                  },
                  py: 2,
                  fontSize: "1.1rem",
                }}
              >
                {loading ? "Creating..." : "Create Artwork"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../Components/AnimatedBackground";
import { useUser } from "../Context/usercontext";
import {
  TextField,
  Button,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  HelpOutline,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import registerBg from "../assets/pexels-suzyhazelwood-1762973.jpg";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "seller",
  });
  const [phone, setPhone] = useState("");
  const [activeButton, setActiveButton] = useState("Registrarse");
  const [activeHelpText, setActiveHelpText] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const formatPhoneNumber = (value) => {
    let cleaned = value.replace(/\D/g, "");
    let formatted = cleaned
      .split("")
      .map((digit, index) => {
        if (index === 3 || index === 5 || index === 7) return ` ${digit}`;
        return digit;
      })
      .join("");
    return formatted;
  };

  const handlePhoneChange = (e) => {
    let formattedNumber = formatPhoneNumber(e.target.value);
    setPhone(formattedNumber);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error and success messages when user is typing
    setError("");
    setSuccessMessage("");

    // Email validation
    if (name === "email") {
      if (!value.includes("@") || !value.includes(".")) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  };

  const handleButtonClick = (btn) => {
    setActiveButton(btn);
    if (btn === "Login") {
      navigate("/Login");
    }
  };

  const handleUserTypeChange = (event) => {
    setFormData({
      ...formData,
      role: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (emailError) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);
      if (result.success) {
        // Registration successful, show success message then redirect to login
        setSuccessMessage("Registration successful! Redirecting to login...");
        setError("");
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          navigate("/Login");
        }, 2000);
      } else {
        // Display specific error message from the backend
        const errorMessage =
          result.error || "Registration failed. Please try again.";
        setError(errorMessage);
        setSuccessMessage("");

        // Handle specific error cases
        if (result.details?.field === "email") {
          setEmailError("This email is already registered");
        }
      }
    } catch (error) {
      setError(
        error?.message ||
          "An unexpected error occurred. Please try again later."
      );
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-4 sm:p-6 lg:p-8 gap-2 md:gap-0 fixed inset-0">
      <AnimatedBackground />
      {/* Left Side */}
      <div className="w-full md:basis-[calc(60%-0.25rem)] min-w-0 overflow-y-auto flex flex-col justify-start md:justify-center px-6 sm:px-10 lg:px-16 items-center bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md border border-white/30 rounded-xl py-12 md:py-0"
        style={{ height: "calc(100vh - 2rem)" }}>
        {/* Buttons */}
        <div className="w-full md:w-2/4 min-w-0 text-center mb-4 md:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            Become a Seller
          </h1>
          <p className="text-sm sm:text-base text-gray-300">
            Create an account to start selling your artwork
          </p>
          <div className="mt-2 md:mt-4">
            <span className="text-xs sm:text-sm text-gray-400">
              Already have an account?{" "}
            </span>
            <button
              onClick={() => navigate("/Login")}
              className="text-yellow-400 hover:text-yellow-300 underline text-xs sm:text-sm"
            >
              Login here
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <form
          onSubmit={handleSubmit}
          className="mt-4 md:mt-6 w-full md:w-2/4 min-w-0"
        >
          {error && (
            <Alert severity="error" className="mb-4" variant="filled">
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" className="mb-4" variant="filled">
              {successMessage}
            </Alert>
          )}

          {/* Full Name */}
          <label className="block text-sm font-medium text-white">
            Full name*
          </label>
          <div className="relative mt-1">
            <div className="relative flex items-center w-full border border-white/30 rounded-xl px-3 py-2 bg-black/20">
              <Person className="text-white/70 mr-2 flex-shrink-0" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="flex-1 text-xs sm:text-sm bg-transparent text-white placeholder-white/50 focus:outline-none min-w-0"
                required
              />
              <span className="relative flex-shrink-0">
                <HelpOutline
                  className="cursor-pointer text-gray-400"
                  onClick={() =>
                    setActiveHelpText(activeHelpText === "name" ? null : "name")
                  }
                />
                {activeHelpText === "name" && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2">
                    <p className="text-xs text-white bg-black p-2 rounded-md mt-1 whitespace-nowrap">
                      Enter your full name.
                    </p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-black"></div>
                  </div>
                )}
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="mt-4 md:mt-6 relative">
            <p className="text-sm font-semibold text-white">Email*</p>
            <div className="relative flex items-center w-full border border-white/30 rounded-xl px-3 py-2 bg-black/20">
              <Email className="text-white/70 mr-2 flex-shrink-0" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="flex-1 text-xs sm:text-sm bg-transparent text-white placeholder-white/50 focus:outline-none min-w-0"
                required
              />
              <span className="relative flex-shrink-0">
                <HelpOutline
                  className="cursor-pointer text-gray-400"
                  onClick={() =>
                    setActiveHelpText(
                      activeHelpText === "email" ? null : "email"
                    )
                  }
                />
                {activeHelpText === "email" && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2">
                    <p className="text-xs text-white bg-black p-2 rounded-md mt-1 whitespace-nowrap">
                      Enter your email.
                    </p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-black"></div>
                  </div>
                )}
              </span>
            </div>
            {emailError && <FormHelperText error>{emailError}</FormHelperText>}
          </div>

          {/* Password */}
          <div className="relative mt-3 md:mt-4">
            <p className="text-sm font-semibold text-white">Password*</p>
            <div className="relative flex items-center w-full border border-white/30 rounded-xl px-3 py-2 bg-black/20">
              <Lock className="text-white/70 mr-2 flex-shrink-0" />
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="flex-1 text-xs sm:text-sm bg-transparent text-white placeholder-white/50 focus:outline-none min-w-0"
                required
              />
              <span className="relative flex-shrink-0">
                <HelpOutline
                  className="cursor-pointer text-gray-400"
                  onClick={() =>
                    setActiveHelpText(
                      activeHelpText === "password" ? null : "password"
                    )
                  }
                />
                {activeHelpText === "password" && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2">
                    <p className="text-xs text-white bg-black p-2 rounded-md mt-1 whitespace-nowrap">
                      Enter Your Password.
                    </p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-black"></div>
                  </div>
                )}
              </span>
              <div className="w-[1px] h-6 bg-gray-300 mx-2 flex-shrink-0"></div>
              <div
                className="flex items-center space-x-1 cursor-pointer select-none flex-shrink-0"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <>
                    <VisibilityOff className="text-gray-400" />
                    <span className="text-xs sm:text-sm text-white/70">
                      Hide
                    </span>
                  </>
                ) : (
                  <>
                    <Visibility className="text-gray-400" />
                    <span className="text-xs sm:text-sm text-white/70">
                      Show
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Must be at least 8 characters.
          </p>

          {/* Phone */}
          <label className="block text-sm font-medium text-white mt-3 md:mt-4">
            Phone <span className="text-white/50">(Optional)</span>
          </label>
          <div className="relative flex items-center w-full border border-white/30 rounded-xl px-3 py-2 bg-black/20 mt-1">
            <span className="text-white/70 mr-2 flex-shrink-0">+34</span>
            <input
              type="tel"
              placeholder="888 88 88 88"
              value={phone}
              onChange={handlePhoneChange}
              className="flex-1 text-xs sm:text-sm bg-transparent text-white placeholder-white/50 focus:outline-none min-w-0"
              maxLength={12}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-black rounded-full py-2 md:py-3 mt-4 md:mt-6"
          >
            {loading ? "Creating account..." : "Start your FREE 14-day trial"}
          </button>
        </form>
      </div>

      {/* Right Side */}
      <div
        className="w-full md:basis-[calc(40%-0.25rem)] min-w-0 overflow-hidden relative bg-cover bg-center flex items-start md:items-center justify-center border rounded-xl p-4 md:ml-2"
        style={{
          backgroundImage: `url(${registerBg})`,
          height: "calc(100vh - 2rem)",
        }}
      >
        <div className="border rounded-xl p-4 absolute inset-0 bg-gradient-to-r from-[#42307d]/80 to-[#7f56d9]/80"></div>
        <div className="relative text-white text-left px-6 sm:px-10 md:px-14 lg:px-16 z-10 min-w-0 overflow-hidden break-words py-4 md:py-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            Manage and showcase your art effortlessly.
          </h1>
          <p className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg lg:text-xl font-bold">
            Streamline your creative workflow, gain visibility, and stay in
            control — all in one place, designed for artists and collectors.
          </p>
          <div className="mt-4 md:mt-6 lg:mt-10 flex space-x-2">
            <div className="flex -space-x-2">
              <img
                src="https://randomuser.me/api/portraits/women/1.jpg"
                className="w-10 h-10 rounded-full border-2 border-white"
                alt="user1"
              />
              <img
                src="https://randomuser.me/api/portraits/men/1.jpg"
                className="w-10 h-10 rounded-full border-2 border-white"
                alt="user2"
              />
              <img
                src="https://randomuser.me/api/portraits/women/2.jpg"
                className="w-10 h-10 rounded-full border-2 border-white"
                alt="user3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

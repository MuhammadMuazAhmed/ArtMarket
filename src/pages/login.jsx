import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../Components/AnimatedBackground";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import {
  Email,
  Lock,
  HelpOutline,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useUser } from "../Context/usercontext";
import loginBg from "../assets/ChatGPT Image Aug 8, 2025, 06_21_06 PM.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [activeButton, setActiveButton] = useState("Acceder");
  const [activeHelpText, setActiveHelpText] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleButtonClick = (btn) => {
    setActiveButton(btn);
    if (btn === "Registrarse") {
      navigate("/Signup");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-4 sm:p-6 lg:p-8 gap-2 relative h-screen overflow-hidden">
      <AnimatedBackground />
      {/* Left Side */}
      <div
        className="w-full md:w-[35%] relative bg-cover bg-center flex items-start md:items-center justify-center border rounded-xl overflow-hidden"
        style={{
          backgroundImage: `url(${loginBg})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#42307d]/80 to-[#7f56d9]/80 border rounded-xl"></div>

        <div className="relative text-white text-left w-full max-w-2xl px-6 sm:px-8 md:px-12 py-4 md:py-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-inter font-bold leading-tight ">
            Manage and showcase your art effortlessly.
          </h1>
          <p className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg lg:text-xl font-bold font-inter text-left">
            Streamline your creative workflow, gain visibility, and stay in
            control — all in one place, designed for artists and sellers.
          </p>
          <div className="mt-4 md:mt-6 lg:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center w-full">
            <div className="flex -space-x-2 flex-shrink-0">
              <img
                src="https://randomuser.me/api/portraits/women/1.jpg"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"
                alt="user1"
              />
              <img
                src="https://randomuser.me/api/portraits/women/3.jpg"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"
                alt="user2"
              />
              <img
                src="https://randomuser.me/api/portraits/women/1.jpg"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"
                alt="user3"
              />
              <img
                src="https://randomuser.me/api/portraits/women/3.jpg"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"
                alt="user4"
              />
              <img
                src="https://randomuser.me/api/portraits/women/3.jpg"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"
                alt="user5"
              />
            </div>
            <div className="text-sm sm:text-base font-semibold font-inter flex-shrink-0 min-w-0 overflow-hidden">
              <div className="text-yellow-400 flex items-center space-x-1 mb-1 sm:mb-0">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  >
                    <path d="M12 2c.3 0 .6.2.7.5l2.4 5.1 5.5.8c.6.1.9.9.4 1.3l-4 4 1 5.7c.1.6-.5 1.1-1 .8l-5-2.7-5 2.7c-.5.3-1.1-.2-1-.8l1-5.7-4-4c-.4-.4-.2-1.2.4-1.3l5.5-.8 2.4-5.1c.1-.3.4-.5.7-.5z" />
                  </svg>
                ))}
                <span className="ml-1 font-inter text-white text-sm sm:text-base">
                  5.0
                </span>
              </div>
              <div className="text-white text-xs sm:text-sm">
                200+ seller reviews
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-[65%] flex flex-col justify-start md:justify-center px-6 sm:p-10 lg:px-16 items-center bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md border border-white/30 rounded-xl md:ml-2 py-12 md:py-0 overflow-hidden">
        <form onSubmit={handleSubmit} className="mt-4 md:mt-6 w-full max-w-sm">
          <div className="text-center mb-4 md:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              Seller Login
            </h1>
            <p className="text-sm sm:text-base text-gray-300">
              Access your seller account
            </p>
            <div className="mt-2 md:mt-4">
              <span className="text-xs sm:text-sm text-gray-400">
                New seller?{" "}
              </span>
              <button
                onClick={() => navigate("/Signup")}
                className="text-yellow-400 hover:text-yellow-300 underline text-xs sm:text-sm"
              >
                Register here
              </button>
            </div>
          </div>

          {error && (
            <Alert severity="error" className="mt-4">
              {error}
            </Alert>
          )}

          <div className="mt-4 md:mt-6 relative">
            <p className="text-sm font-semibold text-white font-inter">
              Email*
            </p>

            <div className="relative flex items-center w-full border border-white/30 rounded-xl px-3 py-2 bg-black/20 focus-within:border-blue-300 hover:border-blue-300 transition duration-300">
              {/* Email Icon */}
              <Email className="text-white/70 mr-2 font-inter flex-shrink-0" />

              {/* Email Input */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your Email"
                className="flex-1 text-xs sm:text-sm bg-transparent text-white placeholder-white/50 focus:outline-none min-w-0"
                required
              />

              {/* Help Icon */}
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
                    <p className="text-xs text-white bg-black p-2 rounded-md mt-1 font-inter whitespace-nowrap">
                      Enter your Email.
                    </p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-black"></div>
                  </div>
                )}
              </span>
            </div>
          </div>

          <div className="relative mt-3 md:mt-4">
            <p className="text-sm font-inter font-semibold text-white">
              Password*
            </p>

            <div className="relative flex items-center w-full border border-white/30 rounded-xl px-3 py-2 bg-black/20 focus-within:border-blue-300 hover:border-blue-300 transition duration-300">
              {/* Lock Icon */}
              <Lock className="text-white/70 mr-2 flex-shrink-0" />

              {/* Password Input */}
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="flex-1 text-xs sm:text-sm bg-transparent text-white placeholder-white/50 focus:outline-none min-w-0"
                required
              />

              {/* Help Icon */}
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
                      Enter your password.
                    </p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-black"></div>
                  </div>
                )}
              </span>

              {/* Separator Line */}
              <div className="w-[1px] h-6 bg-gray-300 mx-2 flex-shrink-0"></div>

              {/* Visibility Toggle */}
              <div
                className="flex items-center space-x-1 cursor-pointer select-none flex-shrink-0"
                role="button"
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
                    <span className="text-xs sm:text-sm text-white/70 font-inter">
                      Show
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <FormControlLabel
            control={<Checkbox />}
            label="Keep the session open"
            className="mt-2"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              backgroundColor: "#fbbf24",
              "&:hover": {
                backgroundColor: "#f59e0b",
              },
              borderRadius: "9999px",
              color: "black",
            }}
            className="mt-4 md:mt-6"
          >
            {loading ? "Signing in..." : "Access my account"}
          </Button>

          <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 cursor-pointer hover:underline">
            Forgot your password?
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

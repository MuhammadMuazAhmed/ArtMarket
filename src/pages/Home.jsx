// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Card from "../Components/Card";
import Sidebar from "../Components/Sidebar";
import AnimatedBackground from "../Components/AnimatedBackground";
import { Dialog, IconButton } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { artworkAPI, purchaseAPI } from "../services/api";
import { useFilter } from "../Context/filtercontext";
import { useUser } from "../Context/usercontext";

const BACKEND_URL = "http://localhost:5000";

function getImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return BACKEND_URL + imageUrl;
}

const Home = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { filters, applied, setApplied } = useFilter();
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user, isAuthenticated } = useUser();

  useEffect(() => {
    if (!applied) return;
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        let params = {};
        // Include only meaningful filters; omit defaults like AllStyles and coerce price to number
        Object.entries(filters).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") return;
          if (key === "style" && value === "AllStyles") return;
          if (key === "price") {
            const num = parseFloat(value);
            if (!isNaN(num) && num > 0) params.price = num;
            return;
          }
          params[key] = value;
        });
        setSearchTerm(""); // Reset search term on apply
        const response = await artworkAPI.getAll(params);
        setArtworks(response.data);
      } catch (error) {
        setError("Failed to load artworks");
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
        setApplied(false);
      }
    };
    fetchArtworks();
    // eslint-disable-next-line
  }, [applied]);

  // Fetch all artworks on initial mount if not applying filters
  useEffect(() => {
    if (applied) return;
    const fetchAllArtworks = async () => {
      try {
        setLoading(true);
        const response = await artworkAPI.getAll();
        setArtworks(response.data);
      } catch (error) {
        setError("Failed to load artworks");
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllArtworks();
    // eslint-disable-next-line
  }, []);

  const filteredArtworks = searchTerm
    ? artworks.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artwork.artist?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : artworks;

  // Handle purchase
  const handlePurchase = async (artworkId) => {
    try {
      // Simple purchase without requiring user details
      const response = await purchaseAPI.createPurchase(artworkId);
      alert(
        "Purchase completed successfully! Transaction ID: " +
          response.data.purchase.transactionId
      );

      // Close modal and refresh artworks
      setShowModal(false);
      setSelectedArtwork(null);

      // Refresh the artworks list to show updated status
      const updatedResponse = await artworkAPI.getAll();
      setArtworks(updatedResponse.data);
    } catch (error) {
      console.error("Purchase error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to complete purchase";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen fixed inset-0 p-4 sm:p-6 lg:p-8">
      <AnimatedBackground />
      <Sidebar page="Home" />
      {/* rightside */}
      <div
        className="w-full md:w-[calc(75%-32px)] bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md flex flex-col border border-white/30 rounded-xl md:ml-[calc(25%+32px)] p-3 sm:p-4 overflow-y-auto"
        style={{
          height: "calc(100vh - 2rem)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 32px rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Fixed header section */}
        <div className="flex flex-col">
          <Navbar />
          {/* searchbar */}
          <div className="flex flex-col items-center w-full mt-10 sm:mt-12 md:mt-14">
            <h1 className="text-2xl sm:text-3xl md:text-5xl mb-4 text-center text-white font-bold drop-shadow-lg px-2">
              Discover your Favourite Artwork
            </h1>
            <input
              type="text"
              placeholder="Search for artwork..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/20 px-3 sm:px-4 py-2 border border-white/50 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 w-full max-w-xl mb-6 text-white placeholder-white/70 shadow-inner"
            />
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-xl text-white">Loading artworks...</div>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center h-64">
              <div className="text-xl text-red-400">{error}</div>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-y-auto flex-1 mt-4">
              <div
                className={`w-full flex flex-wrap gap-3 sm:gap-4 p-2 sm:p-4 ${
                  filteredArtworks.length === 1
                    ? "justify-center items-center"
                    : "justify-center"
                }`}
              >
                {filteredArtworks.length > 0 ? (
                  filteredArtworks.map((artwork) => (
                    <div
                      key={artwork._id}
                      onClick={() => {
                        setSelectedArtwork(artwork);
                        setShowModal(true);
                      }}
                      className="cursor-pointer"
                    >
                      <Card
                        title={artwork.title}
                        author={artwork.artist?.name || "Unknown Artist"}
                        price={`$${artwork.price}`}
                        image={getImageUrl(artwork.imageUrl)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-xl text-center w-full mt-8 text-white drop-shadow-lg">
                    {searchTerm
                      ? "No artworks found matching your search."
                      : "No artworks available."}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Artwork Detail Modal */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            borderRadius: 20,
            overflow: "hidden",
            background: "rgba(17, 24, 39, 0.8)",
            backdropFilter: "blur(10px)",
            maxHeight: "85vh",
          },
        }}
      >
        {selectedArtwork && (
          <>
            <div className="relative grid grid-cols-1 md:grid-cols-2 items-stretch w-full h-full">
              {/* Image */}
              <div className="relative bg-black/20 min-h-[260px] h-full">
                <img
                  src={getImageUrl(selectedArtwork.imageUrl)}
                  alt={selectedArtwork.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              {/* Details */}
              <div className="relative p-6 md:p-8 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md h-full overflow-y-auto">
                <IconButton
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow"
                  size="small"
                >
                  <FaTimes size={16} />
                </IconButton>
                <div className="flex items-center gap-3 mb-3">
                  {selectedArtwork.artist?.profileImage && (
                    <img
                      src={selectedArtwork.artist.profileImage}
                      alt={selectedArtwork.artist.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/30"
                    />
                  )}
                  <span className="text-base md:text-lg font-semibold text-white">
                    {selectedArtwork.artist?.name || "Unknown Artist"}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-1">
                  {selectedArtwork.title}
                </h2>
                <div className="text-xl md:text-2xl font-semibold text-yellow-300 mb-3">
                  ${selectedArtwork.price}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/90 mb-3">
                  {selectedArtwork.medium && (
                    <span>
                      Medium:{" "}
                      <span className="text-white">
                        {selectedArtwork.medium}
                      </span>
                    </span>
                  )}
                  {selectedArtwork.size && (
                    <span>
                      Size:{" "}
                      <span className="text-white">{selectedArtwork.size}</span>
                    </span>
                  )}
                  {selectedArtwork.style && (
                    <span>
                      Style:{" "}
                      <span className="text-white">
                        {selectedArtwork.style}
                      </span>
                    </span>
                  )}
                  {selectedArtwork.technique && (
                    <span>
                      Technique:{" "}
                      <span className="text-white">
                        {selectedArtwork.technique}
                      </span>
                    </span>
                  )}
                </div>
                {selectedArtwork.description && (
                  <p className="text-white/90 max-h-32 overflow-y-auto pr-1">
                    {selectedArtwork.description}
                  </p>
                )}
                <div className="mt-4">
                  {selectedArtwork.status === "sold" ? (
                    <button
                      className="px-8 py-3 bg-red-500 text-white rounded-xl w-full md:w-44 shadow-lg text-lg font-semibold cursor-not-allowed"
                      disabled
                    >
                      Sold
                    </button>
                  ) : (
                    <button
                      className="px-8 py-3 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 w-full md:w-44 shadow-lg text-lg font-semibold"
                      onClick={() => handlePurchase(selectedArtwork._id)}
                    >
                      Buy Art
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default Home;

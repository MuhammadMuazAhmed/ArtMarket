import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HiOutlineMenuAlt2, HiX } from "react-icons/hi";
import { useFilter } from "../Context/filtercontext";

function Sidebar({ page }) {
  const [isopen, setisopen] = useState(false); //buy
  const [isdopen, setisdopen] = useState(false);
  const [ispopen, setispopen] = useState(false); //price
  const [issopen, setissopen] = useState(false); //style
  const [ismopen, setismopen] = useState(false); // Medium
  const [isszopen, setisszopen] = useState(false); // Size
  const [istopen, setistopen] = useState(false); // Techniques
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [showAllMedium, setShowAllMedium] = useState(false);
  const [showAllTechniques, setShowAllTechniques] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { filters, setFilters, setApplied } = useFilter();

  const toggleDropdown = () => setisopen(!isopen);
  const toggledescription = () => setisdopen(!isdopen);
  const togglePriceRange = () => setispopen(!ispopen);
  const toggleOptions = () => setissopen(!issopen);
  const toggleMedium = () => setismopen(!ismopen);
  const toggleSize = () => setisszopen(!isszopen);
  const toggleTechniques = () => setistopen(!istopen);

  const styles = [
    "AllStyles",
    "Abstract",
    "Figurative",
    "Expressionism",
    "Impressionism",
    "Fine Art",
  ];
  const medium = [
    "Canvas",
    "Paper",
    "Wood",
    "Metal",
    "Glass",
    "Fabric",
    "Stone",
    "Ceramic",
    "Digital",
    "Plastic",
  ];
  const size = [
    "Small",
    "Medium",
    "Large",
    "Extra Large",
  ];
  const technique = [
    "Oil Painting",
    "Watercolor",
    "Acrylic",
    "Digital",
    "Charcoal",
    "Ink",
    "Mixed Media",
    "Collage",
    "Spray Paint",
    "Pastel",
  ];

  const renderContent = () => (
    <>
      <h2 className="text-xl font-bold mb-4 text-white">Filter</h2>
      <div onClick={togglePriceRange} className="flex justify-between mt-8">
        <p>Price Range</p>
        {ispopen ? (
          <FaChevronUp className="text-white" />
        ) : (
          <FaChevronDown className="text-white" />
        )}
      </div>
      {ispopen && (
        <div className="w-full max-w-xs mt-4">
          <div className="flex justify-between text-xs mt-2">
            <span>USD</span>
            <span>{filters.price ? `0-${filters.price}$` : "0-500$"}</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="1"
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
            id="priceRange"
            value={filters.price || 0}
            onChange={(e) =>
              setFilters((f) => ({ ...f, price: e.target.value }))
            }
          />
        </div>
      )}
      <hr className="border-gray-600 mt-8" />
      <div onClick={toggleOptions} className="flex justify-between mt-8">
        <p>Style</p>
        <FaChevronDown
          className={`text-white transition-transform ${
            issopen ? "rotate-180" : ""
          }`}
        />
      </div>
      {issopen && (
        <div className="mt-4 space-y-2">
          {(showAllStyles ? styles : styles.slice(0, 3)).map((styles) => (
            <label
              key={styles}
              className="flex items-center space-x-2 text-sm text-white"
            >
              <input
                type="radio"
                name="styles"
                value={styles}
                checked={filters.style === styles}
                onChange={() => setFilters((f) => ({ ...f, style: styles }))}
                className="accent-indigo-500"
              />
              <span>{styles}</span>
            </label>
          ))}
          <button
            className="text-xs text-blue-300 underline mt-2"
            onClick={(e) => {
              e.stopPropagation();
              setShowAllStyles((v) => !v);
            }}
            type="button"
          >
            {showAllStyles ? "Show Less" : "SHOW ALL"}
          </button>
        </div>
      )}
      <hr className="border-gray-600 mt-8" />
      <div onClick={toggleMedium} className="flex justify-between mt-8">
        <p>Medium</p>
        <FaChevronDown
          className={`text-white transition-transform ${
            ismopen ? "rotate-180" : ""
          }`}
        />
      </div>
      {ismopen && (
        <div className="mt-2 ml-2 space-y-2 text-sm text-white">
          {(showAllMedium ? medium : medium.slice(0, 3)).map((medium) => (
            <label
              key={medium}
              className="flex items-center space-x-2 text-sm text-white"
            >
              <input
                type="radio"
                name="medium"
                value={medium}
                checked={filters.medium === medium}
                onChange={() => setFilters((f) => ({ ...f, medium }))}
                className="accent-indigo-500"
              />
              <span>{medium}</span>
            </label>
          ))}
          <button
            className="text-xs text-blue-300 underline mt-2"
            onClick={(e) => {
              e.stopPropagation();
              setShowAllMedium((v) => !v);
            }}
            type="button"
          >
            {showAllMedium ? "Show Less" : "SHOW ALL"}
          </button>
        </div>
      )}
      <hr className="border-gray-600 mt-8" />
      <div onClick={toggleSize} className="flex justify-between mt-8">
        <p>Size</p>
        <FaChevronDown
          className={`text-white transition-transform ${
            isszopen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isszopen && (
        <div className="mt-2 ml-2 space-y-2 text-sm text-white">
          {size.map((size) => (
            <label
              key={size}
              className="flex items-center space-x-2 text-sm text-white"
            >
              <input
                type="radio"
                name="size"
                value={size}
                checked={filters.size === size}
                onChange={() => setFilters((f) => ({ ...f, size }))}
                className="accent-indigo-500"
              />
              <span>{size}</span>
            </label>
          ))}
        </div>
      )}
      <hr className="border-gray-600 mt-8" />
      <div onClick={toggleTechniques} className="flex justify-between my-8">
        <p>Technique</p>
        <FaChevronDown
          className={`text-white transition-transform ${
            istopen ? "rotate-180" : ""
          }`}
        />
      </div>
      {istopen && (
        <div className="mt-2 ml-2 space-y-2 text-sm text-white">
          {(showAllTechniques ? technique : technique.slice(0, 3)).map(
            (technique) => (
              <label
                key={technique}
                className="flex items-center space-x-2 text-sm text-white"
              >
                <input
                  type="radio"
                  name="technique"
                  value={technique}
                  checked={filters.technique === technique}
                  onChange={() => setFilters((f) => ({ ...f, technique }))}
                  className="accent-indigo-500"
                />
                <span>{technique}</span>
              </label>
            )
          )}
          <button
            className="text-xs text-blue-300 underline mt-2"
            onClick={(e) => {
              e.stopPropagation();
              setShowAllTechniques((v) => !v);
            }}
            type="button"
          >
            {showAllTechniques ? "Show Less" : "SHOW ALL"}
          </button>
        </div>
      )}
      <hr className="border-gray-600 mt-8" />
      <div className="flex justify-center mt-4 gap-4">
        <button
          className="px-8 py-2 rounded-full border border-gray-500 text-white hover:bg-gray-800 transition"
          type="button"
          onClick={() => {
            setFilters({
              medium: "",
              size: "",
              style: "",
              technique: "",
              price: "",
            });
            setApplied(true);
          }}
        >
          Reset
        </button>
        <button
          className="px-8 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
          type="button"
          onClick={() => setApplied(true)}
        >
          Apply
        </button>
      </div>
    </>
  );

  // Sidebar for Home (search filters)
  if (page === "Home") {
    return (
      <>
        {/* Mobile Hamburger */}
        <button
          type="button"
          aria-label="Open filters"
          className="md:hidden fixed left-4 top-3 z-50 bg-black/40 text-white border border-white/30 rounded-full p-2 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(true)}
        >
          <HiOutlineMenuAlt2 size={22} />
        </button>

        {/* Desktop static sidebar */}
        <div
          id="app-sidebar"
          className="hidden md:block bg-black/20 backdrop-blur-sm w-1/4 pr-6 lg:pr-8 border rounded-xl text-white p-4 fixed top-8 left-8 bottom-8 z-20 overflow-y-auto"
        >
          <style>{`#app-sidebar{-ms-overflow-style:none;scrollbar-width:none}#app-sidebar::-webkit-scrollbar{display:none}`}</style>
          {renderContent()}
        </div>

        {/* Mobile drawer */}
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileOpen(false)}
            />
            <div className="absolute top-0 left-0 h-full w-[80vw] max-w-sm bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-md border-r border-white/20 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  type="button"
                  aria-label="Close filters"
                  className="text-white/80 hover:text-white"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <HiX size={22} />
                </button>
              </div>
              {renderContent()}
            </div>
          </div>
        )}
      </>
    );
  }

  // Sidebar for Post (create/upload filters - must NOT trigger search)
  if (page === "Post") {
    return (
      <>
        {/* Mobile Hamburger */}
        <button
          type="button"
          aria-label="Open filters"
          className="md:hidden fixed left-4 top-3 z-50 bg-black/40 text-white border border-white/30 rounded-full p-2 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(true)}
        >
          <HiOutlineMenuAlt2 size={22} />
        </button>

        {/* Desktop static sidebar */}
        <div
          id="app-sidebar"
          className="hidden md:block bg-black/20 backdrop-blur-sm w-1/4 pr-6 lg:pr-8 border rounded-xl text-white p-4 fixed top-8 left-8 bottom-8 z-20 overflow-y-auto"
        >
          <style>{`#app-sidebar{-ms-overflow-style:none;scrollbar-width:none}#app-sidebar::-webkit-scrollbar{display:none}`}</style>
          {renderContent()}
        </div>

        {/* Mobile drawer */}
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileOpen(false)}
            />
            <div className="absolute top-0 left-0 h-full w-[80vw] max-w-sm bg-gradient-to-br from-black/60 to-black/30 backdrop-blur-md border-r border-white/20 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">
                  Select Filters
                </h3>
                <button
                  type="button"
                  aria-label="Close filters"
                  className="text-white/80 hover:text-white"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <HiX size={22} />
                </button>
              </div>
              {renderContent()}
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}

export default Sidebar;

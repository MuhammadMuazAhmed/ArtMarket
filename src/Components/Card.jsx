import React, { useMemo } from "react";

function Card({ title, author, price, image }) {
  const placeholder = useMemo(
    () =>
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%23e5e7eb' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16' font-family='Arial, sans-serif'>Image unavailable</text></svg>",
    []
  );

  const handleImgError = (e) => {
    if (e.target && e.target.src !== placeholder) {
      e.target.src = placeholder;
    }
  };

  return (
    <div className="w-[44vw] sm:w-[260px] md:w-[220px] rounded-xl overflow-hidden shadow-lg bg-white">
      <img
        className="w-full h-[28vw] sm:h-40 object-cover"
        src={image || placeholder}
        onError={handleImgError}
        alt={title}
      />
      <div className="px-4 py-3">
        <h2 className="text-lg sm:text-xl font-bold mb-2">{title}</h2>
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-700 text-xs sm:text-sm mr-2">{author}</p>
          <span className="text-base sm:text-lg font-semibold text-gray-800">
            {price}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;

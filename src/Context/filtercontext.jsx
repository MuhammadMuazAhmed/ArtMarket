import React, { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    medium: "",
    size: "",
    style: "",
    technique: "",
    price: "",
  });
  const [applied, setApplied] = useState(false);

  return (
    <FilterContext.Provider
      value={{ filters, setFilters, applied, setApplied }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);

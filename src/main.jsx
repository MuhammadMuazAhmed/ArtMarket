import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./Context/usercontext.jsx";
import { FilterProvider } from "./Context/filtercontext.jsx";
import { ProfilePicProvider } from "./Context/profilepiccontext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <FilterProvider>
        <ProfilePicProvider>
          <App />
        </ProfilePicProvider>
      </FilterProvider>
    </UserProvider>
  </React.StrictMode>
);
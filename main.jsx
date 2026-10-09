import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import NurseryCamDashboard from "./NurseryCamDashboard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NurseryCamDashboard />
  </StrictMode>,
);

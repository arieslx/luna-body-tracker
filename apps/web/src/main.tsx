import React from "react";
import { createRoot } from "react-dom/client";
import { LunaTrackerApp } from "@luna-body-tracker/ui";
import "@luna-body-tracker/ui/styles.css";
import "./pwa";

createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <LunaTrackerApp />
  </React.StrictMode>
);

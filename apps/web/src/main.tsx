import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { LunaRecordProvider } from "./data/record-context";
import { I18nProvider } from "./i18n";
import "./styles.css";

createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <I18nProvider>
      <LunaRecordProvider>
        <App />
      </LunaRecordProvider>
    </I18nProvider>
  </React.StrictMode>,
);

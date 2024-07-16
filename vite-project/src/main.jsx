import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Web3Provider } from "./context/Web3.jsx";
import { ProjectManagerProvider } from "./context/ProjectManager.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Web3Provider>
      <ProjectManagerProvider>
        <App />
      </ProjectManagerProvider>
    </Web3Provider>
  </React.StrictMode>
);

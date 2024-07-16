import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectDetail from "./components/ProjectDetail";
import "./App.css";
import Home from "./Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:address" element={<ProjectDetail />} />
      </Routes>
    </Router>
  );
};

export default App;

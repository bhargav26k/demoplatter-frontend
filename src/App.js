import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SectionPage from "./pages/SectionPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<HomePage />} />
        {/* Dynamic Section Page */}
        <Route path="/section/:id" element={<SectionPage />} />
      </Routes>
    </Router>
  );
}

export default App;

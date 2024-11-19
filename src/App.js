import React from "react";
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Details from "./details";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/details" element={<Details />} />
      </Routes>
    </Router>
  );
}

export default App;
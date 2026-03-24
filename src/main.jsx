import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChapterSelect from "./pages/ChapterSelect";
import ChapterPlay from "./pages/ChapterPlay";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChapterSelect />} />
        <Route path="/play/:slug" element={<ChapterPlay />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

import React from "react";
import "./App.css";
import { Routes, Route, NavLink } from "react-router-dom";
import UploadFile from "./component/UploadFile/UploadFile";
import Home from "./pages/home/Home";
import Images from "./pages/imagePage/Images";

import DetailsPage from "./pages/detailsPage/DetailsPage";
import CountDown from "./pages/countdown/CountDown";
import ImageLayered from "./component/imageLayered/ImageLayered";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="images" element={<Images />} />
          <Route path="countdown" element={<CountDown />} />
          <Route path="upload" element={<UploadFile />} />
          <Route path="image/:id" element={<ImageLayered />} />
          <Route path="details/:id" element={<DetailsPage />} />
        </Route>
        <Route
          path="/*"
          element={
            <>
              <h2>Page Not Found</h2>
              <NavLink to="/">Back to home Page</NavLink>
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

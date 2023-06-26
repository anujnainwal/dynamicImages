import React, { useEffect, useState } from "react";
import CardBox from "./cardBox/CardBox";
import { NavLink } from "react-router-dom";
import axiosInstance from "../../api/axios";

const CountdownContainer = () => {
  let [countdownImage, setCountDownImage] = useState(null);

  return (
    <React.Fragment>
      {/* <img src="http://localhost:5000/api/v1/countdown" alt="countdown" /> */}
      <img src="http://44.206.234.148:5000/api/v1/countdown" alt="countdown" />
      <NavLink to="/countdown/12">
        <CardBox />
      </NavLink>
    </React.Fragment>
  );
};

export default CountdownContainer;

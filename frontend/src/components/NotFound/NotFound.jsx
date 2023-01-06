import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  if (window.location.pathname === "/payment") {
    window.location.replace("/payment");
  }

  return (
    <div className="notFound">
      <div>
        <div>Not Found</div>
        <Link to={"/"}>Go To Home</Link>
      </div>
    </div>
  );
};

export default NotFound;

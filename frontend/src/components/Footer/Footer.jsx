import React from "react";
import playstore from "../../images/playstore.png";
import appstore from "../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download our app for IOS or Android</p>
        <img src={playstore} alt="playstore" />
        <img src={appstore} alt="appstore" />
      </div>
      <div className="middleFooter">
        <h1>ECOMMERCE</h1>
        <p>Quality products at affordable prices.</p>
        <p>Copyright 2022 &copy; zen900220.</p>
      </div>
      <div className="rightFooter">
        <h4>Follow Us:</h4>
        <a href="https://www.google.com/">Instagram</a>
        <a href="https://www.google.com/">Twitter</a>
        <a href="https://www.google.com/">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;

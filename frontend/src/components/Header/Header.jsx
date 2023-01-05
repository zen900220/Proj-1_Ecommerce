import React from "react";
import "./Header.css";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../images/logo.png";
import {
  MdSearch,
  MdOutlineShoppingBag,
  MdAccountCircle,
} from "react-icons/md";

const Header = () => {
  return (
    <ReactNavbar
      //Search icon properties
      searchIcon={true}
      searchIconColor="white"
      SearchIconElement={MdSearch}
      searchIconColorHover="#eb4034"
      searchIconUrl="/search"
      //Cart icon properties
      cartIcon={true}
      cartIconColor="white"
      CartIconElement={MdOutlineShoppingBag}
      cartIconColorHover="#eb4034"
      cartIconMargin="1vmax"
      cartIconUrl="/cart"
      //Profile icon properties
      profileIcon={true}
      profileIconColor="white"
      ProfileIconElement={MdAccountCircle}
      profileIconColorHover="#eb4034"
      profileIconUrl="/login"
      //Burger properties
      burgerColorHover="#eb4034"
      //Logo properties
      logo={logo}
      logoWidth="20vmax"
      logoHoverSize="10px"
      logoHoverColor="#eb4034"
      //Link1 properties
      link1Text="Home"
      link1Url="/"
      link1Size="1.3vmax"
      link1Color="white"
      link1ColorHover="#eb4034"
      link1Margin="1vmax"
      //Link2 properties
      link2Text="Products"
      link2Url="/products"
      //Link3 properties
      link3Text="Contact"
      link3Url="/contact"
      //Link4 properties
      link4Text="About"
      link4Url="/about"
      //nav1 properties
      nav1justifyContent="flex-end"
      navColor1="white"
      //nav2 properties
      nav2justifyContent="flex-end"
      navColor2="black"
      //nav3 properties
      nav3justifyContent="flex-start"
      //nav4 properties
      nav4justifyContent="flex-start"
    />
  );
};

export default Header;

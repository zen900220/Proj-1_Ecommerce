import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "../ProductCard/ProductCard";
import MetaData from "../miscellaneous/MetaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Loader/Loader";
import {
  clearError,
  fetchProducts,
  productsState,
} from "../../slices/product/productsSlice";
import { setError } from "../../slices/utils/errorAlertSlice";

const Home = () => {
  const { status, products, error } = useSelector(productsState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    //? Using Fragment a component can return multiple elements without needing to add an extra div to grp them.
    <Fragment>
      {status === "loading" ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="ECOMMERCE" />
          <div className="banner">
            <p>Welcome To Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW.</h1>
            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>
          <h2 className="homeHeading">Featured Products</h2>
          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;

import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import {
  productsState,
  fetchProducts,
  clearError,
} from "../../slices/product/productsSlice";
import Loader from "../Loader/Loader";
import { setError } from "../../slices/utils/errorAlertSlice";
import ProductCard from "../ProductCard/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import MetaData from "../miscellaneous/MetaData";
import { constants } from "../miscellaneous/constants";

const Products = ({ match }) => {
  const [currentPage, setCurrentPage] = useState(1);
  //We hve 2 prices, priceSlide tht updates in real time as the slider slides.
  //And price which updates once the user is happy with a position and leaves the slider thumb.
  //we update the fetching func with price so that a new fetch request is only made when user is happy with the range and leaves the slider.
  const [price, setPrice] = useState(constants.priceRange);
  const [priceSlide, setPriceSlide] = useState(constants.priceRange);
  const [rating, setRating] = useState(0);
  const [ratingSlide, setRatingSlide] = useState(0);
  const [category, setCategory] = useState("");

  function handlePageChange(newPageNum) {
    setCurrentPage(newPageNum);
  }

  function priceHandler(event, newPriceRange) {
    setPrice(newPriceRange);
  }

  function priceSlideHandler(event, newPriceRange) {
    setPriceSlide(newPriceRange);
  }

  function ratingHandler(event, newRating) {
    setRating(newRating);
  }

  function ratingSlideHandler(event, newRating) {
    setRatingSlide(newRating);
  }

  const { status, products, productCount, resultsPerPage, error } =
    useSelector(productsState);

  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentPage(1);
  }, [error, match.params.keyword, price, category, rating]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        keyword: match.params.keyword,
        page: currentPage,
        price,
        category,
        rating,
      })
    );
  }, [dispatch, match.params.keyword, currentPage, price, category, rating]);

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <Fragment>
      <MetaData title="PRODUCTS" />
      {status === "loading" ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              // "value" determines the value of the slider. If it is static or doesnt change the slider wont move either.
              // so we cant use price here as its only changed on commit.
              // so we use priceSLide and update it in real time
              value={priceSlide}
              onChange={priceSlideHandler}
              onChangeCommitted={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={constants.priceRange[0]}
              max={constants.priceRange[1]}
            />

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              <li
                className="category-link"
                key={"All"}
                onClick={() => setCategory("")}
              >
                All
              </li>
              {constants.categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratingSlide}
                onChange={ratingSlideHandler}
                onChangeCommitted={ratingHandler}
                valueLabelDisplay="auto"
                aria-labelledby="continuous-slider"
                min={0}
                max={5}
              />
            </fieldset>
            <input type="checkbox" />
          </div>

          {productCount > resultsPerPage && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultsPerPage}
                totalItemsCount={productCount}
                onChange={handlePageChange}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;

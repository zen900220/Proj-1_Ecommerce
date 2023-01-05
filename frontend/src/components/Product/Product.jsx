import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./Product.css";
import { useSelector, useDispatch } from "react-redux";
import { setError } from "../../slices/utils/errorAlertSlice";
import {
  clearError,
  fetchSingleProduct,
  newReview,
  productState,
} from "../../slices/product/productSlice";
import ReactStars from "react-rating-stars-component";
import Loader from "../Loader/Loader";
import ReviewCard from "../ReviewCard/ReviewCard";
import MetaData from "../miscellaneous/MetaData";
import {
  addToCart,
  cartState,
  clearError as clearCartError,
  resetSuccess,
} from "../../slices/shopping/cartSlice";
import { userState } from "../../slices/user/userSlice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";

function sideScroll(e) {
  document.querySelector(".reviews").scrollBy({
    left: e.deltaY < 0 ? -30 : 30,
  });
}

const Product = ({ match }) => {
  const { isAuthenticated } = useSelector(userState);
  const { status, product, error } = useSelector(productState);
  const { error: cartError, success } = useSelector(cartState);

  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  function submitReviewToggle() {
    setOpen(!open);
  }

  function decreaseQuantity() {
    let val = Math.max(1, quantity - 1);
    setQuantity(val);
  }

  function increaseQuantity() {
    let val = Math.min(product.stock, quantity + 1);
    setQuantity(val);
  }

  function addItemsToCart(e) {
    dispatch(
      addToCart({
        prod_id: match.params.id,
        quantity,
      })
    );
  }

  function submitReviewHandler(e) {
    const reviewData = {
      productId: match.params.id,
      rating,
      comment,
    };

    dispatch(newReview(reviewData));
    submitReviewToggle();
  }

  useEffect(() => {
    dispatch(fetchSingleProduct(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (success) {
      dispatch(setError("Added To Cart"));
      dispatch(resetSuccess());
    }
  }, [dispatch, success]);

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }

    if (cartError) {
      dispatch(setError(cartError));
      dispatch(clearCartError());
    }
  }, [error, dispatch, cartError]);

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    value: product.rating,
    isHalf: true,
    size: window.innerWidth < 600 ? 20 : 24,
  };

  return (
    <Fragment>
      <MetaData title={`${product.name}`} />
      {status === "loading" ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="Product">
            <div className="imagePanel">
              <Carousel
                animation="slide"
                duration={2000}
                autoPlay={true}
                stopAutoPlayOnHover={true}
              >
                {product.images &&
                  product.images.map((image, i) => {
                    return (
                      <img
                        className="carouselImage"
                        key={image.public_id}
                        src={image.url}
                        alt={`${i + 1} Slide`}
                      />
                    );
                  })}
              </Carousel>
            </div>
            <div className="detailsPanel">
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>{product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <span>({product.numOfReviews} Reviews)</span>
              </div>
              <div className="detailsBlock-3">
                <h1>₹{product.price}</h1>
                {product.stock && isAuthenticated ? (
                  <div className="detailsBlock-3-1">
                    <div className="detailsBlock-3-1-1">
                      <button onClick={decreaseQuantity}>-</button>
                      <input readOnly value={quantity} type="number" />
                      <button onClick={increaseQuantity}>+</button>
                    </div>
                    <button onClick={addItemsToCart}>Add to Cart</button>
                  </div>
                ) : null}
                <p>
                  Status:{" "}
                  <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                    {product.stock < 1 ? "Out Of Stock" : "In Stock"}
                  </b>
                </p>
              </div>
              <div className="detailsBlock-4">
                Description: <p>{product.description}</p>
              </div>
              <button className="submitReview" onClick={submitReviewToggle}>
                Submit Review
              </button>
            </div>
          </div>
          <h3 className="reviewsHeading">REVIEWS</h3>
          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                name="dummy"
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />
              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <DialogActions>
                <Button color="secondary" onClick={submitReviewToggle}>
                  Cancel
                </Button>
                <Button color="primary" onClick={submitReviewHandler}>
                  Submit
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
          {/* Empty arrays and objects are :
                not === true
                not == true
                not === false
                but == false
              we first check if review arr exists and if it does then we check if its len is 0 or not.
              we cant only check for len as at strt product is {} so product.reviews is undefined nd we cnt check
              len of undefined.
            */}
          {product.reviews && product.reviews.length ? (
            <div className="reviews" onWheel={sideScroll}>
              {product.reviews.map((review) => (
                <ReviewCard review={review} key={review._id} />
              ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet!</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Product;

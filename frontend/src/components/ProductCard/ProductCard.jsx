import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import "./ProductCard.css";

const ProductCard = (props) => {
  const product = props.product;

  // {...options} is an alternative to passing attrs seperately
  // the only attrs that we cant add in options directly are data-* and attr-*
  // they must be added as follows: options['data-attrname']=value

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    value: product.rating,
    isHalf: true,
    size: window.innerWidth < 600 ? 20 : 24,
  };

  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      {/* Top1 is used as a temp image until cloudinary is set up. */}
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <ReactStars {...options} />
        <span>{product.numOfReviews} Reviews</span>
      </div>
      <span>₹{product.price}</span>
    </Link>
  );
};

export default ProductCard;

import React, { Fragment } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector } from "react-redux";
import { cartState } from "../../slices/shopping/cartSlice";
import Loader from "../Loader/Loader";
import MetaData from "../miscellaneous/MetaData";

const Cart = ({ history }) => {
  const { contents, status } = useSelector(cartState);

  function checkoutHandler(e) {
    history.push("/shipping");
  }

  return (
    <Fragment>
      {status === "loading" ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Your Cart" />
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>
            <div className="cartContainer">
              {contents.map((content) => (
                <CartItemCard key={content.prod_id} item={content} />
              ))}
            </div>
            <div className="cartGrossProfit">
              <div></div>
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Gross Total</p>
                <p>
                  ₹
                  {contents.reduce((accumulator, content) => {
                    return accumulator + content.price * content.quantity;
                  }, 0)}
                </p>
              </div>
              <div></div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkoutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;

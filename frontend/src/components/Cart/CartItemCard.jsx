import React, { Fragment } from "react";
import "./CartItemCard.css";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteFromCart, updateCart } from "../../slices/shopping/cartSlice";

const CartItemCard = ({ item }) => {
  const dispatch = useDispatch();

  function decreaseQuantity(e) {
    if (item.quantity === 1) return;

    dispatch(
      updateCart({
        prod_id: item.prod_id,
        quantity: item.quantity - 1,
      })
    );
  }

  function increaseQuantity(e) {
    if (item.quantity === item.stock) return;

    dispatch(
      updateCart({
        prod_id: item.prod_id,
        quantity: item.quantity + 1,
      })
    );
  }

  function removeItem(e) {
    dispatch(deleteFromCart(item.prod_id));
  }

  return (
    <Fragment>
      <div className="CartItemCard">
        <img src={item.image} alt="ssa" />
        <div>
          <Link to={`/product/${item.prod_id}`}>{item.name}</Link>
          <span>{`Price: ₹${item.price}`}</span>
          <p onClick={removeItem}>Remove</p>
        </div>
      </div>
      <div className="cartInput">
        <button onClick={decreaseQuantity}>-</button>
        <input type="number" value={item.quantity} readOnly />
        <button onClick={increaseQuantity}>+</button>
      </div>
      <p className="cartSubtotal">{`₹${item.quantity * item.price}`}</p>
    </Fragment>
  );
};

export default CartItemCard;

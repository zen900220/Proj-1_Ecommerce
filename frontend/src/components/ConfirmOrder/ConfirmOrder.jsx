import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import CheckOutSteps from "../CheckOutSteps/CheckOutSteps";
import MetaData from "../miscellaneous/MetaData";
import "./ConfirmOrder.css";
import { shippingState } from "../../slices/shopping/shippingSlice";
import { cartState } from "../../slices/shopping/cartSlice";
import { userState } from "../../slices/user/userSlice";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
const ConfirmOrder = ({ history }) => {
  const { shippingInfo } = useSelector(shippingState);
  const { contents } = useSelector(cartState);
  const { user } = useSelector(userState);

  const { address, city, state, country, pincode, phoneNo } = shippingInfo;
  const { name } = user;

  const completeAddress = `${address},${city}-${pincode},${state},${country}`;
  const subtotal = contents.reduce(
    (accumulator, content) => accumulator + content.price * content.quantity,
    0
  );
  const shippingCharges = subtotal > 1000 ? 0 : 200;
  const tax = 0.18 * subtotal;
  const totalPrice = subtotal + shippingCharges + tax;

  function confirmOrderSubmit(e) {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    history.push("/payment");
  }

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckOutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmShippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmShippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{completeAddress}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items</Typography>
            <div className="confirmCartItemsBox">
              {contents &&
                contents.map((content) => (
                  <div key={content.prod_id}>
                    <img src={content.image} alt={content.name} />
                    <Link to={`/product/${content.prod_id}`}>
                      {content.name}
                    </Link>
                    <span>
                      {content.quantity} X {content.price} = ₹
                      <b>{content.price * content.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div>
          <div className="orderSummary">
            <Typography>Order Summary</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>₹{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>₹{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>₹{tax}</span>
              </div>
            </div>
            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalPrice}</span>
            </div>
            <button onClick={confirmOrderSubmit}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;

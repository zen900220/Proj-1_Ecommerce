import React, { useEffect, useRef, Fragment } from "react";
import CheckOutSteps from "../CheckOutSteps/CheckOutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../miscellaneous/MetaData";
import { Typography } from "@material-ui/core";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { CreditCard, Event, VpnKey } from "@material-ui/icons";
import "./Payment.css";
import { shippingState } from "../../slices/shopping/shippingSlice";
import {
  cartState,
  getCart,
  resetSuccess,
  resetCart,
} from "../../slices/shopping/cartSlice";
import { userState } from "../../slices/user/userSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import {
  clearError,
  createOrder,
  orderState,
} from "../../slices/shopping/orderSlice";

const Payment = ({ history, stripeKey }) => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef();

  const { shippingInfo } = useSelector(shippingState);
  const { contents, success } = useSelector(cartState);
  const { user } = useSelector(userState);
  const { error } = useSelector(orderState);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100), //stripe takes payment in paise for inr
  };

  const orderItems = contents.map((content) => {
    return {
      name: content.name,
      price: content.price,
      image: content.image,
      product: content.prod_id,
      quantity: content.quantity,
    };
  });

  const order = {
    shippingInfo,
    orderItems,
    itemsPrice: orderInfo.subtotal,
    shippingPrice: orderInfo.shippingCharges,
    taxPrice: orderInfo.tax,
    totalPrice: orderInfo.totalPrice,
  };

  async function submitHandler(e) {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );

      const client_secret = response.data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;
        dispatch(setError(result.error.message));
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          dispatch(createOrder(order));
          dispatch(resetCart());
        } else {
          dispatch(
            setError("There has been some issue while processing payment!")
          );
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      dispatch(setError(error.response.data.error));
    }
  }

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      dispatch(getCart());
      dispatch(resetSuccess());
      history.push("/success");
    }
  }, [dispatch, success]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckOutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCard />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <Event />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKey />
            <CardCvcElement className="paymentInput" />
          </div>
          <input
            type="submit"
            value={`Pay ₹${orderInfo?.totalPrice}`}
            ref={payBtn}
            className="paymentBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;

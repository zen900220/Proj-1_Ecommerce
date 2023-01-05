import React, { Fragment, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../Sidebar/Sidebar";
import MetaData from "../miscellaneous/MetaData";
import { Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  orderState,
  getOrderById,
  clearError,
  resetOrderState,
} from "../../slices/shopping/orderSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import { AccountTree } from "@material-ui/icons";
import { constants } from "../miscellaneous/constants";
import {
  adminOrderState,
  reset,
  updateOrder,
} from "../../slices/admin/adminOrderSlice";
import "./EditOrder.css";
// css file not needed as its made from classes and styles of other components

const EditOrder = ({ match }) => {
  const dispatch = useDispatch();

  const { orderById, error } = useSelector(orderState);
  const { success, error: adminError } = useSelector(adminOrderState);

  const { shippingInfo = {} } = orderById;
  const { address, city, state, country, pincode, phoneNo } = shippingInfo;
  const { orderItems: contents } = orderById;

  const completeAddress = `${address},${city}-${pincode},${state},${country}`;

  const newStatus = useRef("");

  function editOrderDataChange(e) {
    newStatus.current = e.target.value;
    console.log(newStatus.current);
  }

  function submitOrderForm(e) {
    e.preventDefault();
    if (newStatus.current === orderById.orderStatus) return;

    let data = { id: orderById._id, status: newStatus.current };
    dispatch(updateOrder(data));
    console.log(data);
  }

  useEffect(() => {
    dispatch(getOrderById(match.params.id));

    return () => dispatch(resetOrderState());
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
    if (adminError) {
      dispatch(setError(adminError));
      dispatch(reset("error"));
    }
  }, [dispatch, error, adminError]);

  useEffect(() => {
    if (success) {
      dispatch(setError("Order Updated"));
      dispatch(reset("success"));
      dispatch(getOrderById(match.params.id));
    }
  }, [success, dispatch]);

  return (
    <Fragment>
      <MetaData title="Admin | Edit Product" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          <div className="confirmOrderPage">
            <div>
              <div className="confirmShippingArea">
                <Typography>Shipping Info</Typography>
                <div className="orderDetailsContainerBox">
                  <div>
                    <p>Name:</p>
                    <span>{orderById?.user?.name}</span>
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
                <Typography>Payment</Typography>
                <div className="orderDetailsContainerBox">
                  <div>
                    <p className="greenColor">PAID</p>
                  </div>
                  <div>
                    <p>Amount:</p>
                    <span>{orderById.totalPrice}</span>
                  </div>
                </div>
                <Typography>Order Status</Typography>
                <div className="orderDetailsContainerBox">
                  <p
                    className={
                      orderById.orderStatus === "Delivered"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {orderById.orderStatus}
                  </p>
                </div>
              </div>
              <div className="confirmCartItems">
                <Typography>Your Cart Items</Typography>
                <div className="confirmCartItemsBox">
                  {contents &&
                    contents.map((content) => (
                      <div key={content.product}>
                        <img src={content.image} alt={content.name} />
                        <Link to={`/product/${content.product}`}>
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
              <form className="updateOrderForm" onSubmit={submitOrderForm}>
                <h1>Edit Order</h1>
                {orderById.orderStatus && (
                  <div>
                    <AccountTree />
                    <select
                      name="status"
                      required
                      defaultValue={orderById.orderStatus}
                      onChange={editOrderDataChange}
                    >
                      <option value="">Choose Category</option>
                      {constants.orderStatuses
                        .slice(
                          constants.orderStatuses.indexOf(orderById.orderStatus)
                        )
                        .map((status, index) => (
                          <option value={status} key={index}>
                            {status}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
                <Button id="createProductBtn" type="submit">
                  Update
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditOrder;

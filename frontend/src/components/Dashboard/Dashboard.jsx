import React, { Fragment, useEffect } from "react";
import "./Dashboard.css";
import Sidebar from "../Sidebar/Sidebar";
import MetaData from "../miscellaneous/MetaData";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import {
  adminProductsState,
  clearError,
  getAdminProducts,
} from "../../slices/admin/adminProductsSlice";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../slices/utils/errorAlertSlice";
import {
  adminOrderState,
  getAllOrders,
  reset,
} from "../../slices/admin/adminOrderSlice";
import {
  adminUserState,
  getAllUsers,
  reset as userReset,
} from "../../slices/admin/adminUserSlice";

const Dashboard = () => {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Title,
    Legend,
    ArcElement
  );

  const dispatch = useDispatch();

  const { products, error } = useSelector(adminProductsState);
  const {
    orders,
    totalAmount,
    error: orderError,
  } = useSelector(adminOrderState);
  const { users, error: userError } = useSelector(adminUserState);

  let outOfStock = 0;
  let totalItems = 0;

  products &&
    products.forEach((item) => {
      if (item.stock <= 0) outOfStock++;
      totalItems++;
    });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197,72,49"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out Of Stock", "In Stock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, totalItems - outOfStock],
      },
    ],
  };

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
    if (orderError) {
      dispatch(setError(orderError));
      dispatch(reset("error"));
    }
    if (userError) {
      dispatch(setError(userError));
      dispatch(userReset("error"));
    }
  }, [error, orderError, userError, dispatch]);

  return (
    <Fragment>
      <MetaData title="Admin | Dashboard" />
      <div className="dashboard">
        <Sidebar />
        <div className="dashboardContainer">
          <Typography component="h1">Dashboard</Typography>
          <div className="dashboardSummary">
            <div>
              <p>
                Total Amount <br /> ₹{totalAmount}
              </p>
            </div>
            <div className="dashboardSummaryBox2">
              <Link to="/admin/products">
                <p>Product</p>
                <p>{totalItems}</p>
              </Link>
              <Link to="/admin/orders">
                <p>Orders</p>
                <p>{orders.length}</p>
              </Link>
              <Link to="/admin/users">
                <p>Users</p>
                <p>{users.length}</p>
              </Link>
            </div>
          </div>
          <div className="lineChart">
            <Line data={lineState} />
          </div>
          <div className="doughnutChart">
            <Doughnut data={doughnutState} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;

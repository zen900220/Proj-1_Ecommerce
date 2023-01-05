import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, orderState } from "../../slices/shopping/orderSlice";
import { userState } from "../../slices/user/userSlice";
import Loader from "../Loader/Loader";
import MetaData from "../miscellaneous/MetaData";
import { DataGrid } from "@material-ui/data-grid";
import "./MyOrders.css";
import { Typography } from "@material-ui/core";
import { setError } from "../../slices/utils/errorAlertSlice";
import { Link } from "react-router-dom";
import { Launch } from "@material-ui/icons";

const MyOrders = () => {
  const dispatch = useDispatch();

  const { status, details, error } = useSelector(orderState);
  const { user } = useSelector(userState);

  const rows = [];
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 250, flex: 0.2 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.15,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      minWidth: 150,
      flex: 0.15,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 150,
      flex: 0.15,
    },
    {
      field: "actions",
      flex: 0.15,
      headerName: "Actions",
      minWidth: 150,
      sortable: false,
      //Pass func tht gives component when called.
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.getValue(params.id, "id")}`}>
            <Launch />
          </Link>
        );
      },
    },
  ];

  details &&
    details.forEach((item) => {
      rows.push({
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
        itemsQty: item.orderItems.reduce(
          (accm, orderItem) => accm + orderItem.quantity,
          0
        ),
      });
    });

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
  }, [dispatch, error]);

  return (
    <Fragment>
      <MetaData title={`${user.name}'s Orders`} />
      {status === "loading" || status === "idle" ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="myOrdersPage">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              autoHeight
              className="myOrdersTable"
            />
            <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default MyOrders;

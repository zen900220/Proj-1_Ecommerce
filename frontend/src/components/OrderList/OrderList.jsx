import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { Delete, Edit } from "@material-ui/icons";
import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  adminOrderState,
  deleteOrder,
  getAllOrders,
  reset,
} from "../../slices/admin/adminOrderSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import Loader from "../Loader/Loader";
import MetaData from "../miscellaneous/MetaData";
import Sidebar from "../Sidebar/Sidebar";
/* Using same classes and styles as ProductList.jsx so its css file does the trick */

const OrderList = () => {
  const dispatch = useDispatch();

  const { status, orders, error, success } = useSelector(adminOrderState);

  function deleteOrderHandler(id) {
    dispatch(deleteOrder(id));
  }

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
      headerName: "Actions",
      minWidth: 150,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        let id = params.getValue(params.id, "id");
        return (
          <Fragment>
            <Link to={`/admin/order/${id}`}>
              <Edit />
            </Link>
            <Button onClick={() => deleteOrderHandler(id)}>
              <Delete />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = orders.map((order) => {
    return {
      id: order._id,
      status: order.orderStatus,
      itemsQty: order.orderItems.reduce(
        (accm, item) => accm + item.quantity,
        0
      ),
      amount: order.totalPrice,
    };
  });

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(reset("error"));
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(getAllOrders());
      dispatch(reset("success"));
      dispatch(setError("Deleted!"));
    }
  }, [dispatch, success]);

  return (
    <Fragment>
      <MetaData title="Admin | Orders" />
      {status === "idle" || status === "loading" ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="dashboard">
            <Sidebar />
            <div className="productListContainer">
              <h1 id="productListHeading">ALL ORDERS</h1>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                className="productListTable"
                autoHeight
              />
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderList;

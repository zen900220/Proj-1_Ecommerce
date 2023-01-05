import { Button, Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { Delete, Star } from "@material-ui/icons";
import React, { Fragment, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminProductsState,
  clearError,
  resetSuccess,
  deleteReview,
  getProductReviews,
} from "../../slices/admin/adminProductsSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import Loader from "../Loader/Loader";
import MetaData from "../miscellaneous/MetaData";
import Sidebar from "../Sidebar/Sidebar";
import "./ReviewList.css";

const ReviewList = () => {
  const dispatch = useDispatch();

  const { status, reviews, error, success } = useSelector(adminProductsState);

  const prodId = useRef("");

  function deleteReviewHandler(id) {
    console.log({ id, productId: prodId.current });
    dispatch(deleteReview({ id, productId: prodId.current }));
  }

  function getReviewsOfProduct() {
    dispatch(getProductReviews(prodId.current));
  }

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 250, flex: 0.5 },
    { field: "name", headerName: "Name", minWidth: 200, flex: 1 },
    { field: "comment", headerName: "Comment", minWidth: 350, flex: 0.3 },
    {
      field: "rating",
      headerName: "Rating",
      minWidth: 60,
      flex: 0.5,
      cellCLassName: (params) => {
        return params.getValue(params.id, "rating") <= 3
          ? "redColor"
          : "greenColor";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        let id = params.getValue(params.id, "id");
        return (
          <Fragment>
            <Button onClick={() => deleteReviewHandler(id)}>
              <Delete />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = reviews.map((item) => {
    return {
      id: item._id,
      name: item.name,
      rating: item.rating,
      comment: item.comment,
    };
  });

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      dispatch(resetSuccess());
      dispatch(getProductReviews(prodId.current));
      dispatch(setError("Deleted!"));
    }
  }, [dispatch, success]);

  return (
    <Fragment>
      <MetaData title="Admin | Products" />
      {status === "loading" ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="dashboard">
            <Sidebar />
            <div className="productListContainer">
              <form className="getReviewsForm" onSubmit={getReviewsOfProduct}>
                <Typography component="h1">Enter Product ID</Typography>
                <div>
                  <Star />
                  <input
                    type="text"
                    name="id"
                    placeholder="Product ID"
                    onChange={(e) => (prodId.current = e.target.value)}
                  />
                </div>
                <Button id="getReviewsBtn" type="submit">
                  Get Reviews
                </Button>
              </form>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
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

export default ReviewList;

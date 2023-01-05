import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { Delete, Edit } from "@material-ui/icons";
import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  adminProductsState,
  clearError,
  getAdminProducts,
  resetSuccess,
  deleteProduct,
} from "../../slices/admin/adminProductsSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import Loader from "../Loader/Loader";
import MetaData from "../miscellaneous/MetaData";
import Sidebar from "../Sidebar/Sidebar";
import "./ProductList.css";

const ProductList = () => {
  const dispatch = useDispatch();

  const { status, products, error, success } = useSelector(adminProductsState);

  function deleteProductHandler(id) {
    dispatch(deleteProduct(id));
  }

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 250, flex: 0.5 },
    { field: "name", headerName: "Name", minWidth: 350, flex: 1 },
    { field: "stock", headerName: "Stock", minWidth: 150, flex: 0.3 },
    { field: "price", headerName: "Price", minWidth: 270, flex: 0.5 },
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
            <Link to={`/admin/product/${id}`}>
              <Edit />
            </Link>
            <Button onClick={() => deleteProductHandler(id)}>
              <Delete />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = products.map((item) => {
    return {
      id: item._id,
      name: item.name,
      stock: item.stock,
      price: item.price,
    };
  });

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(getAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(getAdminProducts());
      dispatch(resetSuccess());
      dispatch(setError("Deleted!"));
    }
  }, [dispatch, success]);

  return (
    <Fragment>
      <MetaData title="Admin | Products" />
      {status === "idle" || status === "loading" ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="dashboard">
            <Sidebar />
            <div className="productListContainer">
              <h1 id="productListHeading">ALL PRODUCTS</h1>
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

export default ProductList;

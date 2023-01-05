import { DataGrid } from "@material-ui/data-grid";
import { Delete, Edit } from "@material-ui/icons";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  adminUserState,
  deleteUser,
  getAllUsers,
  reset,
  updateUser,
} from "../../slices/admin/adminUserSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import Loader from "../Loader/Loader";
import MetaData from "../miscellaneous/MetaData";
import Sidebar from "../Sidebar/Sidebar";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Select,
  MenuItem,
} from "@material-ui/core";
// Same css as ProductList

const ProductList = () => {
  const dispatch = useDispatch();

  const { status, users, error, success } = useSelector(adminUserState);

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const [role, setRole] = useState(null);

  function roleChangeToggle() {
    setOpen(!open);
  }

  function roleChangeHandler(e) {
    setRole(e.target.value);
  }

  function submitRoleChange(e) {
    e.preventDefault();
    if (user.role === role || !role) return;
    dispatch(updateUser({ id: user._id, role }));
    roleChangeToggle();
  }

  function deleteUserHandler(id) {
    dispatch(deleteUser(id));
  }

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 250, flex: 0.5 },
    { field: "name", headerName: "Name", minWidth: 250, flex: 0.5 },
    { field: "email", headerName: "Email", minWidth: 250, flex: 0.7 },
    { field: "role", headerName: "Role", minWidth: 100, flex: 0.2 },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 0.1,
      sortable: false,
      renderCell: (params) => {
        let id = params.getValue(params.id, "id");
        return (
          <Fragment>
            <Button
              onClick={() => {
                setUser(users.find((user) => user._id === id));
                roleChangeToggle();
              }}
            >
              <Edit />
            </Button>
            <Button onClick={() => deleteUserHandler(id)}>
              <Delete />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = users.map((user) => {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  });

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(reset("error"));
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(setError("Successful!"));
      dispatch(getAllUsers());
      dispatch(reset("success"));
    }
  }, [dispatch, success]);

  useEffect(() => {
    if (!open) {
      setUser({});
      setRole(null);
    }
  }, [open]);

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
              <h1 id="productListHeading">ALL USERS</h1>
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
          {user.role && (
            <Dialog
              aria-labelledby="simple-dialog-title"
              open={open}
              onClose={roleChangeToggle}
            >
              <DialogTitle>Enter User Role</DialogTitle>
              <DialogContent className="submitDialog">
                <Select
                  label="Role"
                  onChange={roleChangeHandler}
                  defaultValue={user.role}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
                <DialogActions>
                  <Button color="secondary" onClick={roleChangeToggle}>
                    Cancel
                  </Button>
                  <Button color="primary" onClick={submitRoleChange}>
                    Submit
                  </Button>
                </DialogActions>
              </DialogContent>
            </Dialog>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductList;

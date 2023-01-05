import React, { Fragment, useRef, useEffect } from "react";
import "./EditPassword.css";
import { MdLockOpen, MdOutlineVpnKey, MdLock } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePassword,
  userState,
  clearError,
  resetUpdate,
} from "../../slices/user/userSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import MetaData from "../miscellaneous/MetaData";

const EditPassword = ({ history }) => {
  const dispatch = useDispatch();

  const { error, isUpdated } = useSelector(userState);

  const passwordObj = useRef({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function updatePasswordSubmit(e) {
    e.preventDefault();
    dispatch(updatePassword(passwordObj.current));
  }

  function updatePasswordDataChange(e) {
    passwordObj.current[e.target.name] = e.target.value;
  }

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (isUpdated) {
      dispatch(setError("Successfully updated Password!"));
      dispatch(resetUpdate());
      history.push("/account");
    }
  }, [isUpdated, dispatch, history]);
  return (
    <Fragment>
      <MetaData title="Change Password" />
      <div className="UpdatePswdContainer">
        <div className="UpdatePswdBox">
          <h2>Edit Password</h2>
          <form className="updatePswdForm" onSubmit={updatePasswordSubmit}>
            <div>
              <MdOutlineVpnKey />
              <input
                type="password"
                placeholder="Current Password"
                name="oldPassword"
                required
                onChange={updatePasswordDataChange}
              />
            </div>
            <div>
              <MdLockOpen />
              <input
                type="password"
                placeholder="New Password"
                name="newPassword"
                required
                onChange={updatePasswordDataChange}
              />
            </div>
            <div>
              <MdLock />
              <input
                type="password"
                placeholder="Confirm New Password"
                name="confirmPassword"
                required
                onChange={updatePasswordDataChange}
              />
            </div>
            <input type="submit" value="Update" className="updatePswdBtn" />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default EditPassword;

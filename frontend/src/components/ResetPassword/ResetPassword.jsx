import React, { Fragment, useRef, useEffect } from "react";
import { MdLockOpen, MdLock } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  userState,
  clearError,
  resetUpdate,
} from "../../slices/user/userSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import Loader from "../Loader/Loader";
import MetaData from "../miscellaneous/MetaData";
import "./ResetPassword.css";

const ResetPassword = ({ match, history }) => {
  const dispatch = useDispatch();

  const { error, isAuthenticated, status, isUpdated } = useSelector(userState);

  const passwordObj = useRef({
    password: "",
    confirmPassword: "",
  });

  function resetPasswordSubmit(e) {
    e.preventDefault();
    const myData = {
      ...passwordObj.current,
      token: match.params.token,
    };

    dispatch(resetPassword(myData));
  }

  function passwordDataChange(e) {
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
      dispatch(setError("Password Updated Successfully"));
      dispatch(resetUpdate());
    }
    if (isAuthenticated) {
      history.push("/account");
    }
  }, [isAuthenticated, dispatch, history, isUpdated]);

  return (
    <Fragment>
      <MetaData title="Reset Password" />
      {status === "loading" ? (
        <Loader />
      ) : (
        <div className="ResetPswdContainer">
          <div className="ResetPswdBox">
            <h2>Reset Password</h2>
            <form className="resetPswdForm" onSubmit={resetPasswordSubmit}>
              <div>
                <MdLockOpen />
                <input
                  type="password"
                  placeholder="New Password"
                  name="password"
                  required
                  onChange={passwordDataChange}
                />
              </div>
              <div>
                <MdLock />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  name="confirmPassword"
                  required
                  onChange={passwordDataChange}
                />
              </div>
              <input
                type="submit"
                value="Change Password"
                className="resetPswdBtn"
              />
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ResetPassword;

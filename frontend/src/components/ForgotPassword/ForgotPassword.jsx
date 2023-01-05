import React, { useEffect, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearError,
  resetMessage,
  userState,
} from "../../slices/user/userSlice";
import MetaData from "../miscellaneous/MetaData";
import { MdOutlineMail } from "react-icons/md";
import { forgotPassword } from "../../slices/user/userSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import Loader from "../Loader/Loader";
import "./ForgotPassword.css";

const ForgotPassword = ({ history }) => {
  const dispatch = useDispatch();

  const { status, error, message, isAuthenticated } = useSelector(userState);

  const email = useRef("");

  function ForgotPasswordSubmit(e) {
    e.preventDefault();
    dispatch(forgotPassword(email.current));
  }

  function emailChange(e) {
    email.current = e.target.value;
  }

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (message) {
      dispatch(setError(message));
      dispatch(resetMessage());
    }
    if (isAuthenticated) {
      history.push("/account");
    }
  }, [dispatch, message, isAuthenticated, history]);

  return (
    <Fragment>
      <MetaData title="Forgot Password" />
      {status === "loading" ? (
        <Loader />
      ) : (
        <div className="ForgotPswdContainer">
          <div className="ForgotPswdBox">
            <h2>Enter Email To Send Password Reset Mail</h2>
            <form className="forgotPswdForm" onSubmit={ForgotPasswordSubmit}>
              <div>
                <MdOutlineMail />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  required
                  onChange={emailChange}
                />
              </div>
              <input type="submit" value="Submit" className="forgotPswdBtn" />
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ForgotPassword;

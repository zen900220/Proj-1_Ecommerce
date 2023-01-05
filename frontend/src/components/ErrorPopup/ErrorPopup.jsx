import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./ErrorPopup.css";
import { resetError } from "../../slices/utils/errorAlertSlice";

const ErrorPopup = (props) => {
  const dispatch = useDispatch();

  //on every render of the error alert, reset error after 5 seconds which in turn removes the error popup.
  useEffect(() => {
    setTimeout(() => dispatch(resetError()), 5000);
  });

  return <div className="error-screen">{props.text}</div>;
};

export default ErrorPopup;

import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { userState } from "../../slices/user/userSlice";
import Loader from "../Loader/Loader";

const ProtectedRoute = ({ isAdmin, component: Component, ...options }) => {
  const { status, isAuthenticated, user } = useSelector(userState);
  return (
    <Fragment>
      {status === "loading" || status === "idle" ? (
        <Loader />
      ) : (
        <Route
          {...options}
          render={(props) => {
            if (!isAuthenticated) {
              return <Redirect to="/login" />;
            }
            if (isAdmin && user.role !== "admin") {
              return <Redirect to="/login" />;
            }
            return <Component {...props} />;
          }}
        />
      )}
    </Fragment>
  );
};

export default ProtectedRoute;

//? Routes can be passed component in 3 ways : component, render, children
//? we can give component a component but if we give it an inline function that returns
//? a component then it will keep recreating the component every re-render instead of jst
//? updating the existing component. So we use render which updates rather than
//? unmounting and recreating.
//? the "props" passed to the inline func in render contains {match,history,location}
//? if we pass a component directly to render, component or children then these 3 get
//? sent automatically but in case of inline func we gotta pass them to the func
//? and then give to component by spreading them.
//? component/render/children takes the name of the component which is akin to passing func that gives value when called
//? so if we use an inline func as their value then the inline func needs to return a component rather than a func that returns a component
//? so we call the component func and then return the final value as the return of the inline func.

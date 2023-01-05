import React, { Fragment, useEffect } from "react";
import MetaData from "../miscellaneous/MetaData";
import "./Account.css";
import { useSelector } from "react-redux";
import { userState } from "../../slices/user/userSlice";
import Profile from "../../images/Profile.png";
import { Link } from "react-router-dom";

const Account = ({ history }) => {
  const { user, isAuthenticated } = useSelector(userState);

  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/login");
    }
  }, [isAuthenticated, history]);

  return (
    <Fragment>
      <MetaData title={`${user.name}'s Account`} />
      <div className="profileContainer">
        <div>
          <h1>My Profile</h1>
          <img src={user?.avatar?.url || Profile} alt="IMG" />
          <Link to="/me/update">Edit Profile</Link>
        </div>
        <div>
          <div>
            <h4>Full Name</h4>
            <p>{user.name}</p>
          </div>
          <div>
            <h4>Email</h4>
            <p>{user.email}</p>
          </div>
          <div>
            <h4>Joined On</h4>
            <p>{String(user.createdAt).substring(0, 10)}</p>
          </div>
          <div>
            <Link to="/orders">My Orders</Link>
            <Link to="/password/update">Change Password</Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Account;

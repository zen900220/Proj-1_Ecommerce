import React, { Fragment, useRef, useState, useEffect } from "react";
import "./EditProfile.css";
import { MdMailOutline, MdFace } from "react-icons/md";
import Profile from "../../images/Profile.png";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUser,
  userState,
  clearError,
  resetUpdate,
} from "../../slices/user/userSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import MetaData from "../miscellaneous/MetaData";

const EditProfile = ({ history }) => {
  const dispatch = useDispatch();

  const { user, error, isUpdated } = useSelector(userState);

  const avatar = useRef(undefined);
  const userObj = useRef({ name: user.name, email: user.email });

  const [avatarPreview, setAvatarPreview] = useState(
    user.avatar.url || Profile
  );

  function updateDataChange(e) {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          avatar.current = reader.result;
          setAvatarPreview(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      userObj.current[e.target.name] = e.target.value;
    }
  }

  function updateSubmit(e) {
    e.preventDefault();

    const updateForm = {
      name: userObj.current.name,
      email: userObj.current.email,
      avatar: avatar.current,
    };
    console.log(updateForm);
    dispatch(updateUser(updateForm));
  }

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isUpdated) {
      dispatch(setError("Update Done!"));
      dispatch(resetUpdate());
      history.push("/account");
    }
  }, [isUpdated, history, dispatch]);

  return (
    <Fragment>
      <MetaData title="Update Profile" />
      <div className="UpdateContainer">
        <div className="UpdateBox">
          <h2>Edit Profile</h2>
          <form className="updateForm" onSubmit={updateSubmit}>
            <div className="updateName">
              <MdFace />
              <input
                type="text"
                placeholder="Name"
                defaultValue={user.name}
                name="name"
                onChange={updateDataChange}
              />
            </div>
            <div className="updateEmail">
              <MdMailOutline />
              <input
                type="email"
                placeholder="Email"
                defaultValue={user.email}
                name="email"
                onChange={updateDataChange}
              />
            </div>
            <div id="updateImage">
              <img src={avatarPreview} alt="Avatar Preview" />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateDataChange}
              />
            </div>
            <input type="submit" value="Update" className="updateBtn" />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default EditProfile;

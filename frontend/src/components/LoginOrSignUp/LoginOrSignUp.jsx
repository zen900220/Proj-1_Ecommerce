import React, { Fragment, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LoginOrSignUp.css";
import { MdMailOutline, MdLockOpen, MdFace } from "react-icons/md";
import Profile from "../../images/Profile.png";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  userState,
  clearError,
} from "../../slices/user/userSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import Loader from "../Loader/Loader";
import MetaData from "../miscellaneous/MetaData";

const LoginOrSignUp = ({ history }) => {
  const dispatch = useDispatch();

  const switcherTab = useRef();
  const loginTab = useRef();
  const registerTab = useRef();

  const loginEmail = useRef("");
  const loginPassword = useRef("");

  const user = useRef({
    name: "",
    email: "",
    password: "",
  });
  const avatar = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(Profile);

  const { name, email, password } = user.current;

  const { error, status, isAuthenticated } = useSelector(userState);

  useEffect(() => {
    if (error) {
      dispatch(setError(error)); //User has seen error so lets reset error field.
      dispatch(clearError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/account");
    }
  }, [isAuthenticated, history]);

  function switchTabs(e, tab) {
    if (tab === "login") {
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftIntoFrame");
      loginTab.current.classList.remove("shiftToLeft");
    } else if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");

      registerTab.current.classList.add("shiftIntoFrame");
      loginTab.current.classList.add("shiftToLeft");
    }
  }

  function loginSubmit(e) {
    e.preventDefault();

    dispatch(
      loginUser({ email: loginEmail.current, password: loginPassword.current })
    );
  }

  function registerSubmit(e) {
    e.preventDefault();

    const myForm = {
      name,
      email,
      password,
      avatar: avatar.current,
    };

    dispatch(registerUser(myForm));
  }

  function registerDataChange(e) {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          avatar.current = reader.result;
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      user.current[e.target.name] = e.target.value;
    }
  }

  return (
    <Fragment>
      {status === "loading" ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="LOGIN | REGISTER" />
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="LoginSignUpToggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>

              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MdMailOutline />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    onChange={(e) => (loginEmail.current = e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <MdLockOpen />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    onChange={(e) => (loginPassword.current = e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>

              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <MdFace />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MdMailOutline />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <MdLockOpen />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    onChange={registerDataChange}
                  />
                </div>
                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginOrSignUp;

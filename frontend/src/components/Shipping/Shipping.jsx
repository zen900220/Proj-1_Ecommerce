import React, { Fragment, useEffect, useRef, useState } from "react";
import "./Shipping.css";
import {
  PinDrop,
  Home,
  LocationCity,
  Public,
  Phone,
  TransferWithinAStation,
} from "@material-ui/icons";
import { Country, State } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  setShippingInfo,
  shippingState,
} from "../../slices/shopping/shippingSlice";
import { setError } from "../../slices/utils/errorAlertSlice";
import MetaData from "../miscellaneous/MetaData";
import CheckOutSteps from "../CheckOutSteps/CheckOutSteps";

const Shipping = ({ history }) => {
  const dispatch = useDispatch();

  const { shippingInfo, error } = useSelector(shippingState);

  const { address, city, state, pincode, phoneNo } = shippingInfo;

  const [country, setCountry] = useState(shippingInfo.country);

  const details = useRef({
    address,
    city,
    state,
    pincode,
    phoneNo,
  });

  function shippingSubmit(e) {
    e.preventDefault();

    if (/^\d{10}$/.test(details.current.phoneNo) === false) {
      return dispatch(setError("Phone No. should be 10 digits long!"));
    }

    dispatch(
      setShippingInfo({
        ...details.current,
        country,
      })
    );

    history.push("/order/confirm");
  }

  function detailsChangeHandler(e) {
    if (e.target.name === "country") {
      return setCountry(e.target.value);
    }
    details.current[e.target.name] = e.target.value;
  }

  useEffect(() => {
    if (error) {
      dispatch(setError(error));
      dispatch(clearError());
    }
  }, [dispatch, error]);

  return (
    <Fragment>
      <MetaData title="Shipping Details" />
      <CheckOutSteps activeStep={0} />
      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>
          <form className="shippingForm" onSubmit={shippingSubmit}>
            <div>
              <Home />
              <input
                type="text"
                placeholder="Address"
                name="address"
                required
                defaultValue={details.current.address}
                onChange={detailsChangeHandler}
              />
            </div>
            <div>
              <LocationCity />
              <input
                type="text"
                placeholder="City"
                name="city"
                required
                defaultValue={details.current.city}
                onChange={detailsChangeHandler}
              />
            </div>
            <div>
              <PinDrop />
              <input
                type="number"
                placeholder="Pincode"
                name="pincode"
                required
                defaultValue={details.current.pincode}
                onChange={detailsChangeHandler}
              />
            </div>
            <div>
              <Phone />
              <input
                type="number"
                placeholder="Phone Number"
                name="phoneNo"
                required
                defaultValue={details.current.phoneNo}
                onChange={detailsChangeHandler}
              />
            </div>
            <div>
              <Public />
              <select
                name="country"
                required
                defaultValue={country}
                onChange={detailsChangeHandler}
              >
                <option value="">Country</option>
                {Country &&
                  Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>
            {country && (
              <div>
                <TransferWithinAStation />
                <select
                  name="state"
                  required
                  defaultValue={details.current.state}
                  onChange={detailsChangeHandler}
                >
                  <option value="">State</option>
                  {State.getStatesOfCountry(country).map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <input type="submit" value="Continue" className="shippingBtn" />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;

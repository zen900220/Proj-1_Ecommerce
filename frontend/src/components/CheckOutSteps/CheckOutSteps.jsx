import { Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import {
  AccountBalance,
  LibraryAddCheck,
  LocalShipping,
} from "@material-ui/icons";
import React, { Fragment } from "react";
import "./CheckOutSteps.css";

const CheckOutSteps = ({ activeStep }) => {
  const steps = [
    {
      label: <Typography>Shipping Details</Typography>,
      icon: <LocalShipping />,
    },
    {
      label: <Typography>Order Details</Typography>,
      icon: <LibraryAddCheck />,
    },
    {
      label: <Typography>Payment</Typography>,
      icon: <AccountBalance />,
    },
  ];

  const stepStyles = {
    boxSizing: "border-box",
  };

  return (
    <Fragment>
      <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
        {steps.map((item, index) => (
          <Step
            key={index}
            active={index === activeStep}
            completed={index < activeStep}
          >
            <StepLabel
              style={{
                color: index <= activeStep ? "tomato" : "rgba(0,0,0,0.649)",
              }}
              icon={item.icon}
            >
              {item.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Fragment>
  );
};

export default CheckOutSteps;

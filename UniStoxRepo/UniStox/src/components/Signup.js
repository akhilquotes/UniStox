import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Stepper from "react-stepper-horizontal";
import Step1 from "./stepper/Step1";
import Step2 from "./stepper/Step2";
import Step3 from "./stepper/Step3";
import Step4 from "./stepper/Step4";

const SignUp = ({ user, setUser }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      title: "Personal Details",
    },
    {
      title: "Account Details",
    },
    {
      title: "KYC",
    },
    {
      title: "Add Funds",
    },
  ];

  const onClickNext = () => {
    setCurrentStep(currentStep + 1);
  };
  const onClickPrevious = () => {
    setCurrentStep(currentStep - 1);
  };
  return (
    <div>
      <Stepper steps={steps} activeStep={currentStep} />
      {currentStep === 0 && (
        <Step1
          user={user}
          setUser={setUser}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === 1 && (
        <Step2
          user={user}
          setUser={setUser}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === 2 && (
        <Step3
          user={user}
          setUser={setUser}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          doSignUp="true"
        />
      )}
      {currentStep === 3 && (
        <Step4
          user={user}
          setUser={setUser}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          currencyVal={""}
          showSkip="true"
        />
      )}
      {/* <br />
      {currentStep !== 0 && (
        <Button style={{ float: "left" }} onClick={onClickPrevious}>
          Previous
        </Button>
      )}
      {currentStep !== steps.length - 1 && (
        <Button style={{ float: "right" }} onClick={onClickNext}>
          Next
        </Button>
      )} */}
    </div>
  );
};

export default SignUp;

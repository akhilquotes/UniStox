import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

const Step1 = ({ user, setUser, currentStep, setCurrentStep }) => {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleNext = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div style={{ marginTop: "2vh" }}>
        <div className="p-4 box" style={{ height: "30em" }}>
          <h2 className="mb-3">Account Details</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form noValidate onSubmit={handleNext}>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Control
                type="text"
                placeholder="First Name"
                name="FirstName"
                onChange={onChange}
                value={user.FirstName}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Control
                type="text"
                placeholder="Last Name"
                name="LastName"
                onChange={onChange}
                value={user.LastName}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email address"
                name="Email"
                onChange={onChange}
                value={user.Email}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                name="Password"
                onChange={onChange}
                value={user.Password}
              />
            </Form.Group>

            <div class="d-flex align-items-end" style={{ height: "23vh" }}>
              <Button className="ms-auto" variant="info" type="submit">
                Next
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Step1;

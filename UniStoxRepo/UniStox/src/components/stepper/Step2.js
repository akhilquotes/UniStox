import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Alert, Button } from "react-bootstrap";
import { useRapyd } from "../../context/RapydContext";

const Step2 = ({ user, setUser, currentStep, setCurrentStep }) => {
  const [error, setError] = useState("");
  const { listCountries } = useRapyd();
  const [countries, setCountries] = useState();

  useEffect(() => {
    listCountries().then((res) => {
      setCountries(res.body.data);
    });
  }, []);
  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div style={{ marginTop: "2vh" }}>
        <div className="p-4 box" style={{ height: "30em" }}>
          <h2 className="mb-3">Personal Details</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="formBasicCountry">
              <Form.Select
                name="Country"
                onChange={onChange}
                value={user.Country}
                required
              >
                <option>Select Country</option>
                {countries &&
                  countries.map((x) => (
                    <option value={x.iso_alpha2}>{x.name}</option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicAddress">
              <Form.Control
                as="textarea"
                placeholder="Address"
                name="Address"
                onChange={onChange}
                value={user.Address}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicMobile">
              <Form.Control
                type="text"
                placeholder="Mobile Number(include country code)"
                name="Mobile"
                onChange={onChange}
                value={user.Mobile}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDOB">
              <Form.Control
                type="date"
                placeholder="Date of Birth"
                name="DOB"
                onChange={onChange}
                value={user.DOB}
              />
            </Form.Group>
            <div class="d-flex align-items-end" style={{ height: "20vh" }}>
              <Button
                className="me-auto"
                variant="info"
                onClick={handlePrevious}
              >
                Previous
              </Button>
              <Button className="ms-auto" variant="info" onClick={handleNext}>
                Next
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Step2;

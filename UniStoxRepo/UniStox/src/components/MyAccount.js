import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useFirestore } from "../context/FirestoreContext";
import Swal from "sweetalert2";

const MyAccount = ({ user, setUser }) => {
  const [error, setError] = useState("");
  const { addDocument } = useFirestore();
  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const saveChanges = () => {
    Swal.fire({
      title: "Saving details..please wait",
    });
    Swal.showLoading();
    addDocument(user, "Users").then((res) => {
      Swal.close();
      Swal.fire("Updated details", "", "success");
    });
  };

  return (
    <div className="d-flex">
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="p-4 box" style={{ height: "35em", marginTop: "2vh" }}>
        <h2 className="mb-3">Personal Details</h2>
        <Form>
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
              readOnly
              disabled
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
          <Form.Group className="mb-3" controlId="formBasicAddress">
            <Form.Control
              as="textarea"
              placeholder="Address"
              name="Address"
              onChange={onChange}
              value={user.Address}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Country"
              name="Country"
              onChange={onChange}
              value={user.Country}
            />
          </Form.Group>
        </Form>
      </div>
      <div
        className="p-4 box"
        style={{ height: "35em", marginTop: "2vh", marginLeft: "2vh" }}
      >
        <h2 className="mb-3">Account Details</h2>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Control
              type="text"
              placeholder="Bank Name"
              name="BankName"
              onChange={onChange}
              value={user.BankName}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Control
              type="text"
              placeholder="Account Number"
              name="BankAccount"
              onChange={onChange}
              value={user.BankAccount}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder="IFSC Code"
              name="BankIFSC"
              onChange={onChange}
              value={user.BankIFSC}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="text"
              placeholder="Account Holder Name"
              name="BankAccountHolder"
              onChange={onChange}
              value={user.BankAccountHolder}
            />
          </Form.Group>
          <div class="d-flex align-items-end" style={{ height: "15em" }}>
            <Button className="ms-auto" variant="success" onClick={saveChanges}>
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MyAccount;

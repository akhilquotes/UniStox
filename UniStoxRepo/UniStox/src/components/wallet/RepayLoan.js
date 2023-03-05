import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useFantom } from "../../context/FantomContext";
import Swal from "sweetalert2";
import { useFirestore } from "../../context/FirestoreContext";

const RepayLoan = ({ user, loan }) => {
  const { deposit } = useFantom();
  const { addDocument } = useFirestore();
  const [amount, setAmount] = useState();
  const [existingLoan, setExistingLoan] = useState();

  useEffect(() => {
    setExistingLoan(loan);
  }, []);
  const handleConfirm = () => {
    if (parseFloat(amount) > parseFloat(loan)) {
      Swal.fire({
        title: "Please enter amount less than existing loan!",
        icon: "error",
      });
    } else {
      let date = new Date();
      Swal.fire({
        title: "processing transaction..please wait",
      });
      Swal.showLoading();
      deposit(
        user.FantomAcc.wallet_address,
        amount,
        user.FantomAcc.wallet_privatekey
      ).then((y) => {
        if (y.status === true) {
          let loanRepayDoc = {
            Email: user.Email,
            Amount: -1 * parseFloat(amount),
            Currency: "FTM",
            Type: "Repaid",
            TransactionDate: date.getTime(),
            // TransactionDate: `${
            //   date.getMonth() + 1
            // }-${date.getDate()}-${date.getFullYear()}`,
          };
          addDocument(loanRepayDoc, "UserLoanTransactions").then((res) => {
            Swal.close();
            Swal.fire({
              title: "Transferred successfully!",
              html: `<a href="https://testnet.ftmscan.com/tx/${y.transactionHash}" target="_blank">${y.transactionHash}</a>`,
              icon: "success",
            });
          });
        } else {
          Swal.close();
          Swal.fire("Error!", "", "error");
        }
      });
    }
  };

  return (
    <>
      <Row>
        <Col xs={4}>
          <Form.Group className="mb-3">
            <Form.Label>Existing Loan = {existingLoan} FTM</Form.Label>
          </Form.Group>
        </Col>
        {parseFloat(existingLoan) > 0 ? (
          <>
            <Col xs={8}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Enter FTM to repay loan:
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Amount in FTM"
                  name="amount"
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                />
              </Form.Group>
            </Col>
          </>
        ) : (
          "No loan history available!"
        )}
      </Row>

      <Row>
        <Col className="d-flex align-items-end">
          <Button className="ms-auto" variant="warning" onClick={handleConfirm}>
            Confirm
          </Button>
          {/* </div> */}
        </Col>
      </Row>
    </>
  );
};

export default RepayLoan;

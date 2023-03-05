import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useRapyd } from "../../context/RapydContext";
import { useFantom } from "../../context/FantomContext";
import Swal from "sweetalert2";
import { createPath } from "react-router-dom";

const BuyFTM = ({ user, currency, balance }) => {
  const { getFantomPrice, sendFTMFromContractToAddress, deposit } = useFantom();
  const { walletTransfer } = useRapyd();
  const [amount, setAmount] = useState();
  const [fxRate, setFxRate] = useState("");
  const [dedAmount, setDedAmount] = useState();
  const onAmountChange = (e) => {
    setAmount(e.target.value);
    console.log(e.target.value);
    let deductedAmount = parseFloat(e.target.value) * parseFloat(fxRate);
    console.log(deductedAmount);
    setDedAmount(parseFloat(deductedAmount.toFixed(3)));
  };
  useEffect(() => {
    getFantomPrice("FTM", currency).then((res) => {
      setFxRate(res.rate.toFixed(5));
    });
  }, []);
  const handleConfirm = () => {
    if (parseFloat(balance) < dedAmount) {
      console.log("balance", balance);
      Swal.fire({
        title: "Amount exceeds existing currency wallet balance!",
        html: ``,
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "processing transaction..please wait",
      });
      Swal.showLoading();
      sendFTMFromContractToAddress(user.FantomAcc.wallet_address, amount).then(
        (y) => {
          if (y.status === true) {
            console.log(dedAmount);
            walletTransfer(
              user.RapydAcc.ewallet_id,
              Math.ceil(dedAmount),
              currency,
              "buy"
            ).then((x) => {
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
        }
      );
    }
  };

  return (
    <>
      <Row>
        <Col xs={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              1 FTM = {fxRate} {currency}
            </Form.Label>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Enter FTM to buy:
              <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Amount"
              name="amount"
              onChange={onAmountChange}
              value={amount}
            />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group className="mb-3">
            <Form.Label>Amount to be deducted in {currency}:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Deducted Amount"
              name="dedAmount"
              disabled
              value={dedAmount}
            />
          </Form.Group>
        </Col>
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

export default BuyFTM;

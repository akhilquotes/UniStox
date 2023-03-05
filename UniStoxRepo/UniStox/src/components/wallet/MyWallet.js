import React, { useEffect, useState, useRef } from "react";
import {
  Col,
  Row,
  Table,
  Button,
  Form,
  Card,
  InputGroup,
} from "react-bootstrap";
import { useRapyd } from "../../context/RapydContext";
import { useFantom } from "../../context/FantomContext";
import { useFirestore } from "../../context/FirestoreContext";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import Step4 from "../stepper/Step4";
import Swal from "sweetalert2";
import BuyFTM from "./BuyFTM";
import Step3 from "../stepper/Step3";
import "./MyWallet.css";
import { BsEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { Input } from "react-bootstrap-typeahead";
import LoanFTM from "./LoanFTM";
import SellFTM from "./SellFTM";
import RepayLoan from "./RepayLoan";

const MyWallet = ({ user, setUser, ftmBalance, setFtmBalance, portfolio }) => {
  const { getWalletTransactions, listWallets, listCountries } = useRapyd();
  const { listAddressTransactions, listInternalTransactions, getBalance } =
    useFantom();
  const { getDocuments } = useFirestore();
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [toggleRefresh, setToggleRefresh] = useState(0);
  const [currency, setCurrency] = useState("");
  const [wallet, setWallet] = useState({});
  const [clickCurrency, setClickCurrency] = useState("");
  const [clickBalance, setClickBalance] = useState(0);
  const [transactionTitle, setTransactionTitle] = useState("Transactions");
  const [passwordType, setPasswordType] = useState("password");
  const [loanAmount, setLoanAmount] = useState(0);

  const handleClose = () => {
    setShowAdd(false);
    toggleRefresh === 0 ? setToggleRefresh(1) : setToggleRefresh(0);
  };
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  const handleTransactions = (type, acnt) => {
    if (type == "wallet") {
      setTransactionTitle("Currency Wallet Transactions");
      getWalletTransactions(user.RapydAcc.ewallet_id, acnt.currency).then(
        (x) => {
          console.log(x.body.data);
          setTransactions(x.body.data);
        }
      );
    } else if (type == "fantom") {
      setTransactionTitle("Fantom Wallet Transactions");
      let totalTransactions = [];
      listAddressTransactions(user.FantomAcc.wallet_address).then((x) => {
        if (x.length > 0) {
          totalTransactions.push(...x);
        }
        listInternalTransactions(user.FantomAcc.wallet_address).then((y) => {
          if (y.length > 0) {
            totalTransactions.push(...y);
          }
          //console.log(totalTransactions);
          let sortedData = totalTransactions.sort(
            (a, b) => b.timeStamp - a.timeStamp
          );
          setTransactions(sortedData);
        });
      });
    } else if (type == "loan") {
      setTransactionTitle("FTM Loan Transactions");
      getDocuments(user.Email, "UserLoanTransactions", "Email").then((docs) => {
        console.log("loan", docs);
        let sortedData = docs.sort(
          (a, b) => moment(b.TransactionDate) - moment(a.TransactionDate)
        );
        setTransactions(sortedData);
      });
    }
  };
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      const urlParams = new URLSearchParams(window.location.search);
      const message = urlParams["message"];
      if (message === "success") {
        Swal.fire("Funds added successfully!", "", "success");
      } else if (message === "failure") {
        Swal.fire("Failed to add funds!", "", "error");
      }
      isInitialMount.current = false;
    }
    console.log(user);
    listWallets(
      user.RapydAcc.ewallet_reference_id,
      user.Email === "johndoe2@gmail.com" ? "company" : "person"
    ).then((x) => {
      const walletObj = { ...x.body.data[0] };
      let acnts = [...walletObj.accounts];
      listCountries().then((res) => {
        let countryData = res.body.data;
        let reqCountry = countryData.filter(
          (x) => x.iso_alpha2 == user.Country
        )[0];
        setCurrency(reqCountry.currency_code);
        if (user.Email !== "johndoe@gmail.com") {
          acnts = acnts.filter((x) => x.currency == reqCountry.currency_code);
        }
        setAccounts(acnts);
        setWallet(walletObj);
      });
    });
    getBalance(user.FantomAcc.wallet_address).then((bal) => {
      setFtmBalance(parseFloat(bal.replace('"', "")).toFixed(2));
    });
    getDocuments(user.Email, "UserLoanTransactions", "Email").then((docs) => {
      console.log(docs);
      let loan = 0;
      docs.forEach((doc) => {
        loan += parseFloat(doc.Amount);
        setLoanAmount(loan.toFixed(2));
      });
    });
  }, [user, toggleRefresh]);

  return (
    <>
      <Modal
        show={showAdd}
        onHide={handleClose}
        animation={false}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalTitle !== "Add Funds Enabled" ? modalTitle : "Add Funds"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalTitle.includes("Add Funds") ? (
            modalTitle === "Add Funds" ? (
              <Step4 user={user} currencyVal={clickCurrency} showSkip="false" />
            ) : (
              <Step4 user={user} currencyVal="" showSkip="false" />
            )
          ) : modalTitle === "Take Loan in FTM" ? (
            <LoanFTM user={user} portfolio={portfolio} loan={loanAmount} />
          ) : modalTitle === "Repay FTM Loan" ? (
            <RepayLoan user={user} loan={loanAmount} />
          ) : modalTitle === "Buy FTM" ? (
            <BuyFTM
              user={user}
              currency={clickCurrency}
              balance={clickBalance}
            />
          ) : (
            <SellFTM user={user} currency={currency} ftmBalance={ftmBalance} />
          )}
        </Modal.Body>
      </Modal>
      {/* <Row className="m-2">
        <Col sm={2}>
          <b>E-Wallet Id :</b>{" "}
        </Col>
        <Col lg={4}>{user.RapydAcc.ewallet_id}</Col>
      </Row> */}
      <Row className="m-2">
        <Col sm={2}>
          <b>Fantom Wallet Address :</b>{" "}
        </Col>
        <Col lg={4}>{user.FantomAcc.wallet_address}</Col>
      </Row>
      {user.Email != "johndoe@gmail.com" && (
        <Row className="m-2">
          <Col sm={2}>
            <b>Fantom Wallet PrivateKey :</b>{" "}
          </Col>
          <Col lg={4}>
            <InputGroup>
              <Form.Control
                type={passwordType === "password" ? "password" : "text"}
                value={user.FantomAcc.wallet_privatekey}
                style={{ border: "none", padding: "0px" }}
              />
              <InputGroup.Text
                style={{ backgroundColor: "white", border: "none" }}
              >
                <Button
                  className="btn btn-light"
                  onClick={togglePassword}
                  style={{ backgroundColor: "white", border: "none" }}
                >
                  {passwordType === "password" ? (
                    <BsEyeFill />
                  ) : (
                    <BsFillEyeSlashFill />
                  )}
                </Button>
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
      )}
      <Row className="mt-3">
        <Col xs={7}>
          <div class="d-flex align-items-end">
            <Button
              className="ms-auto"
              variant="link"
              onClick={() => {
                setShowAdd(true);
                setModalTitle("Add Funds Enabled");
              }}
            >
              Add Funds
            </Button>
          </div>

          <Card className="tblCard">
            <Card.Header style={{ color: "orange" }}>
              <h3>Currency Wallet</h3>
            </Card.Header>
            <Card.Body>
              {accounts.length > 0 ? (
                <Table
                  striped
                  bordered
                  className="table table-hover"
                  size="sm"
                  style={{ marginBottom: "0" }}
                >
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>Currency</th>
                      <th>Balance</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((x) => {
                      return (
                        <tr>
                          <td>{x.id}</td>
                          <td>{x.currency}</td>
                          <td>{x.balance}</td>

                          <td>
                            <Button
                              className="badge mx-1"
                              variant="primary"
                              onClick={() => {
                                setShowAdd(true);
                                setModalTitle("Add Funds");
                                setClickCurrency(x.currency);
                              }}
                            >
                              Add Funds
                            </Button>
                            <Button
                              className="badge mx-1"
                              variant="info"
                              onClick={() => {
                                setShowAdd(true);
                                setModalTitle("Buy FTM");
                                setClickCurrency(x.currency);
                                setClickBalance(x.balance);
                              }}
                            >
                              Buy FTM
                            </Button>
                            <Button
                              className="badge mx-1"
                              variant="success"
                              onClick={() => handleTransactions("wallet", x)}
                            >
                              Transactions
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                "No accounts available..Click Add Funds!"
              )}
            </Card.Body>
          </Card>
          <br />
          <Card className="tblCard">
            <Card.Header style={{ color: "orange" }}>
              <h3>Fantom Wallet</h3>
            </Card.Header>
            <Card.Body>
              <Table
                striped
                bordered
                className="table table-hover"
                size="sm"
                style={{ marginBottom: "0" }}
              >
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Currency</th>
                    <th>Balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{user.FantomAcc.wallet_address}</td>
                    <td>FTM</td>
                    <td>{ftmBalance}</td>

                    <td>
                      <Button
                        className="badge mx-1"
                        variant="warning"
                        onClick={() => {
                          setShowAdd(true);
                          setModalTitle("Sell FTM");
                        }}
                      >
                        Sell FTM
                      </Button>
                      <Button
                        className="badge mx-1"
                        variant="success"
                        onClick={() =>
                          handleTransactions(
                            "fantom",
                            user.FantomAcc.wallet_address
                          )
                        }
                      >
                        Transactions
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          <br />
          <Card className="tblCard">
            <Card.Header style={{ color: "orange" }}>
              <h3>Available FTM Loan</h3>
            </Card.Header>
            <Card.Body>
              <Table
                striped
                bordered
                className="table table-hover"
                size="sm"
                style={{ marginBottom: "0" }}
              >
                <thead>
                  <tr>
                    <th>Existing Loan</th>
                    <th>Currency</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{loanAmount}</td>
                    <td>FTM</td>
                    <td>
                      <Button
                        className="badge mx-1"
                        variant="primary"
                        onClick={() => {
                          setShowAdd(true);
                          setModalTitle("Take Loan in FTM");
                        }}
                      >
                        Loan FTM
                      </Button>
                      <Button
                        className="badge mx-1"
                        variant="info"
                        onClick={() => {
                          setShowAdd(true);
                          setModalTitle("Repay FTM Loan");
                        }}
                      >
                        Repay Loan
                      </Button>
                      <Button
                        className="badge mx-1"
                        variant="success"
                        onClick={() => handleTransactions("loan", "")}
                      >
                        Transactions
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={5} style={{ "overflow-x": "auto" }}>
          <div className="my-3" style={{ color: "orange" }}>
            <h2>{transactionTitle}</h2>
          </div>
          {transactions.length > 0 ? (
            transactionTitle === "Currency Wallet Transactions" ? (
              <Table
                responsive
                className="table table-hover"
                size="sm"
                style={{ maxHeight: "380px", overflow: "auto" }}
              >
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((x) => {
                    return (
                      <tr>
                        <td>{x.id}</td>
                        <td>{x.amount}</td>
                        <td>{x.currency}</td>
                        <td>{x.type}</td>
                        <td>{x.balance}</td>
                        <td>
                          {moment(x.created_at * 1000).format(
                            "DD-MM-YYYY h:mm:ss"
                          )}
                        </td>
                        <td>{x.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : transactionTitle.includes("Fantom") ? (
              <Table
                responsive
                className="table table-hover"
                size="sm"
                style={{ maxHeight: "380px", overflow: "auto" }}
              >
                <thead>
                  <tr>
                    <th>TxHash</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((x) => {
                    if (
                      x.hash != "" &&
                      x.from != "0x15d248eb6175d225e834cc0bb41009512dfba25f"
                    ) {
                      return (
                        <tr>
                          <td>{x.hash}</td>
                          <td>{x.from}</td>
                          <td>{x.to}</td>
                          <td>{x.value}</td>
                          <td>
                            {moment(x.timeStamp * 1000).format(
                              "DD-MM-YYYY h:mm:ss"
                            )}
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </Table>
            ) : (
              <Table
                responsive
                className="table table-hover"
                size="sm"
                style={{ maxHeight: "380px", overflow: "auto" }}
              >
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Transaction Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((x) => {
                    return (
                      <tr>
                        <td>{x.Type}</td>
                        <td>{x.Amount} FTM</td>
                        <td>
                          {moment(x.TransactionDate).format(
                            "DD-MM-YYYY h:mm:ss"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )
          ) : (
            "No transaction available!"
          )}
        </Col>
      </Row>
    </>
  );
};

export default MyWallet;

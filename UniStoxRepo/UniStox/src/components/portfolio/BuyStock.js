import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Alert } from "react-bootstrap";
import { Button, Row, Col } from "react-bootstrap";
import { getGlobalQuote } from "../Lib/StocksApi";
import { useRapyd } from "../../context/RapydContext";
import { useFantom } from "../../context/FantomContext";
import { useFirestore } from "../../context/FirestoreContext";
import Swal from "sweetalert2";

const BuyStock = ({
  stock,
  user,
  portfolio,
  setPortfolio,
  ftmBalance,
  setFtmBalance,
}) => {
  const [error, setError] = useState("");
  const [lots, setLots] = useState(0);
  const [globalQuote, setGlobalQuote] = useState({});
  const {
    getWalletBalance,
    walletExchangeTransfer,
    bankToCompanyTransfer,
    listCountries,
    listWallets,
  } = useRapyd();
  const { getFantomPrice, deposit, getBalance } = useFantom();
  const [balance, setBalance] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCurrencyAmount, setTotalCurrencyAmount] = useState(0);
  const { addDocument, getDocuments } = useFirestore();
  const [ftmStockPrice, setFtmStockPrice] = useState();
  const [stockPrice, setStockPrice] = useState();
  let multiplier = stock["Currency"] === "INR" ? 1 / 80 : 1;
  useEffect(() => {
    console.log(user);
    setBalance(ftmBalance);
    getGlobalQuote(stock["AlphaTicker"])
      .then((resp) => resp.json())
      .then((item) => {
        setGlobalQuote(item["Global Quote"]);
        getFantomPrice(stock["Currency"], "FTM").then((res) => {
          console.log(item["Global Quote"]["05. price"]);
          let price =
            parseFloat(res.rate.toFixed(5)) *
            parseFloat(item["Global Quote"]["05. price"]);
          setStockPrice(item["Global Quote"]["05. price"]);
          setFtmStockPrice(price.toFixed(2));
        });
        //console.log(item);
      });
  }, []);
  const fetchAmount = (e) => {
    setLots(e.target.value);
    const lots = e.target.value;
    const amount = parseInt(lots) * parseFloat(ftmStockPrice);
    const currencyAmount = parseInt(lots) * parseFloat(stockPrice);
    setTotalAmount(parseFloat(amount.toFixed(2)));
    setTotalCurrencyAmount(currencyAmount.toFixed(2));
  };
  const executeOrder = () => {
    let date = new Date();

    if (parseFloat(totalAmount) > parseFloat(balance)) {
      Swal.fire({
        icon: "error",
        title: "Insufficient funds in wallet!",
        //text: 'Something went wrong!',
        footer: '<a href="/mywallet">Do u want to buy FTM?</a>',
      });
    } else {
      Swal.fire({
        title: "processing order..please wait",
      });
      Swal.showLoading();
      let doc = {
        Email: user.Email,
        Symbol: stock["AlphaTicker"],
        CompanyName: stock["Company Name"],
        Price: ftmStockPrice,
        Quantity: parseInt(lots),
        Currency: stock["Currency"],
        Type: "Buy",
        CO2E: "",
        ProcessingFee: 0.01 * parseFloat(totalAmount),
        TransactionDate: `${
          date.getMonth() + 1
        }-${date.getDate()}-${date.getFullYear()}`,
      };

      deposit(
        user.FantomAcc.wallet_address,
        totalAmount,
        user.FantomAcc.wallet_privatekey
      ).then((x) => {
        if (x.status === true) {
          listWallets(
            "John-Doe-d90b85d8-519e-4412-8341-263d9eba9ced",
            user.Email === "johndoe2@gmail.com" ? "company" : "person"
          ).then((ac) => {
            const walletObj = { ...ac.body.data[0] };
            let acnts = [...walletObj.accounts];
            acnts = acnts.filter((fa) => fa.currency === stock["Currency"])[0];
            console.log(acnts);
            if (acnts.balance < totalCurrencyAmount) {
              let debt = totalCurrencyAmount - acnts.balance;
              console.log("debt", debt);

              bankToCompanyTransfer(debt, stock["Currency"]).then((y) => {
                let debtDoc = y.body.data;
                walletExchangeTransfer(
                  totalCurrencyAmount,
                  stock["Currency"],
                  "buy"
                ).then((z) => {
                  addDocument(debtDoc, "DebtTransactions").then((res) => {
                    addDocument(doc, "UserPortfolio").then((res) => {
                      getDocuments(user.Email, "UserPortfolio", "Email").then(
                        (res) => {
                          setPortfolio(res);
                          getBalance(user.FantomAcc.wallet_address).then(
                            (bal) => {
                              setFtmBalance(
                                parseFloat(bal.replace('"', "")).toFixed(2)
                              );
                              Swal.close();
                              Swal.fire({
                                title: "Purchase successful!",
                                html: `<a href="https://testnet.ftmscan.com/tx/${x.transactionHash}" target="_blank">${x.transactionHash}</a>`,
                                icon: "success",
                              });
                            }
                          );
                        }
                      );
                    });
                  });
                });
              });
            } else {
              walletExchangeTransfer(
                totalCurrencyAmount,
                stock["Currency"],
                "buy"
              ).then((z) => {
                addDocument(doc, "UserPortfolio").then((res) => {
                  getDocuments(user.Email, "UserPortfolio", "Email").then(
                    (res) => {
                      setPortfolio(res);
                      getBalance(user.FantomAcc.wallet_address).then((bal) => {
                        setFtmBalance(
                          parseFloat(bal.replace('"', "")).toFixed(2)
                        );
                        Swal.close();
                        Swal.fire({
                          title: "Purchase successful!",
                          html: `<a href="https://testnet.ftmscan.com/tx/${x.transactionHash}" target="_blank">${x.transactionHash}</a>`,
                          icon: "success",
                        });
                      });
                    }
                  );
                });
              });
            }
          });
        } else {
          Swal.close();
          Swal.fire("Failed to buy", "Please try later!", "error");
        }
      });
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col xs={9}></Col>
        <Col xs={3}>
          <b>Available Funds : </b>
          {balance} FTM
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Form.Group className="mb-3" controlId="formBasicLots">
            <Form.Label>Enter no. of lots to buy</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter no.of stocks to buy"
              name="Lots"
              onChange={fetchAmount}
              value={lots}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicPrice">
            <Form.Label>Stock Price in FTM</Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder="Close Price"
              name=""
              value={ftmStockPrice}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={6}></Col>
        <Col xs={3}></Col>
        <Col xs={3}>
          <Form.Group className="mb-3" controlId="formBasicLots">
            <Form.Label>Total Amount</Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder="Total amount"
              value={totalAmount}
            />
          </Form.Group>
        </Col>
      </Row>
      <div class="d-flex align-items-end" style={{ height: "6vh" }}>
        <Button className="ms-auto" variant="primary" onClick={executeOrder}>
          Execute order
        </Button>
      </div>
    </>
  );
};

export default BuyStock;

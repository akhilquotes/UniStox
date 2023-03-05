import React, { useState, useEffect } from "react";
import { Col, Row, Table, Card, Button } from "react-bootstrap";
import { useRapyd } from "../../context/RapydContext";
import { useFantom } from "../../context/FantomContext";
import { useFirestore } from "../../context/FirestoreContext";
import TransactionTable from "./TransactionTable";
import moment from "moment";
import LoanVsCollateralChart from "../portfolio/LoanVsCollateralChart";
import StockPerformanceChart from "../portfolio/StockPerformanceChart";

const Earnings = ({ user, loan, portfolio }) => {
  const { listWallets, getWalletTransactions } = useRapyd();
  const { getFantomPrice } = useFantom();
  const { getDocuments } = useFirestore();
  const [transactions, setTransactions] = useState([]);
  const [transactionTitle, setTransactionTitle] = useState("Transactions");
  const [procFee, setProcFee] = useState(0);
  const [interest, setInterest] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [collateral, setCollateral] = useState(0);
  const [procFeeTrans, setProcFeeTrans] = useState([]);
  const [intrstTrans, setintrstTrans] = useState([]);

  const handleTransactions = (type) => {
    if (type == "procFee") {
      setTransactionTitle("Total Transactions");
      getDocuments("", "UserPortfolio", "CO2E").then((docs) => {
        let data = docs;
        let sortedData = data.sort(
          (a, b) => moment(b.TransactionDate) - moment(a.TransactionDate)
        );
        setTransactions(sortedData);
      });
    } else if (type == "loanUsers") {
      setTransactionTitle("Loan Users");
      let userList = [];
      let uniqueUsers = [...new Set(loan.map((item) => item.Email))];
      for (let x in uniqueUsers) {
        let email = uniqueUsers[parseInt(x)];
        let reqDocs = portfolio.filter((x) => x.Email == email);
        let reqColl = reqDocs.reduce(
          (prev, curr) =>
            (prev += parseFloat(curr.Price) * parseFloat(curr.Quantity)),
          0
        );
        let reqLoanDocs = loan.filter((x) => x.Email == email);
        let reqLoan = reqLoanDocs.reduce(
          (prev, curr) => (prev += parseFloat(curr.Amount)),
          0
        );
        if (reqLoan > 0) {
          userList.push({ Email: email, Collateral: reqColl, Loan: reqLoan });
        }
      }
      setTransactions(userList);
      console.log(userList);
    }
  };
  const getLoanWorth = () => {
    let amt = 0;
    let coll = 0;
    let uniqueUsers = [...new Set(loan.map((item) => item.Email))];
    loan.forEach((doc) => {
      amt += parseFloat(doc.Amount);
      setLoanAmount(parseFloat(amt.toFixed(2)));
    });

    uniqueUsers.forEach((email) => {
      let reqDocs = portfolio.filter((x) => x.Email == email);
      let reqColl = reqDocs.reduce(
        (prev, curr) =>
          (prev += parseFloat(curr.Price) * parseFloat(curr.Quantity)),
        0
      );
      coll += reqColl;
      console.log("port", coll);
      setCollateral(parseFloat(coll.toFixed(2)));
    });
  };

  const getLoanSeries = () => {
    let docs = loan;
    let currentDay = new Date().getTime();
    let diffDates = getDates(
      moment(currentDay).subtract(10, "days"),
      currentDay
    );

    let rates = diffDates.map((y) => {
      let reqDocs = docs.filter(
        (x) =>
          moment(x.TransactionDate).format("YYYY-MM-DD") <=
          moment(y).format("YYYY-MM-DD")
      );
      let reqLoan = reqDocs.reduce(
        (prev, curr) => (prev += parseFloat(curr.Amount)),
        0
      );
      let reqIntr = 0.1 * parseFloat(reqLoan);
      return { Date: y, Loan: reqLoan, Value: reqIntr };
    });

    let totalIntr = rates.reduce(
      (prev, curr) => (prev += parseFloat(curr.Value)),
      0
    );
    console.log(rates);
    setInterest(totalIntr);
    setintrstTrans(rates);
    //console.log("rates", rates);
  };
  const getDates = (startDate, stopDate) => {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      currentDate = moment(currentDate).add(1, "days");
    }
    return dateArray;
  };
  useEffect(() => {
    getDocuments("", "UserPortfolio", "CO2E").then((docs) => {
      var result = [];
      for (let stock of docs) {
        if (
          result.filter((x) => x.Date === stock.TransactionDate).length === 0
        ) {
          let reqStocks = docs.filter(
            (x) => x.TransactionDate == stock.TransactionDate
          );
          console.log(reqStocks);
          let reqPrice = 0;
          for (let s of reqStocks) {
            let procCostOfStocks = parseFloat(s.ProcessingFee);
            reqPrice += procCostOfStocks;
          }
          let obj = {
            Date: stock.TransactionDate,
            Value: parseFloat(reqPrice),
          };
          result.push(obj);
        }
      }
      setProcFeeTrans(result);
      let proc = 0;
      docs.forEach((doc) => {
        proc += parseFloat(doc.ProcessingFee);
      });
      setProcFee(proc.toFixed(3));
    });
    //getLoanInterest();
    getLoanSeries();
    getLoanWorth();
  }, [user]);

  return (
    <>
      <Row style={{ textAlign: "center", color: "orange", fontSize: "40px" }}>
        <span>Admin Dashboard</span>
        <hr />
      </Row>
      <Row>
        <Col xs={4}>
          <StockPerformanceChart
            perfData={procFeeTrans}
            keyCol="Value"
            title="Processing Fee"
            series="Value"
            color="#447dd4"
          />
        </Col>
        <Col xs={4}>
          <StockPerformanceChart
            perfData={intrstTrans}
            keyCol="Value"
            title="Earnings on interest of loans"
            series="Value"
            color="#79b545"
          />
        </Col>
        <Col xs={4}>
          <LoanVsCollateralChart
            loanAmount={loanAmount}
            portfolio={collateral}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={5}>
          <Card className="tblCard">
            <Card.Header style={{ color: "orange" }}>
              <h3>Earnings</h3>
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
                    <th>Type</th>
                    <th>Amount in FTM</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Processing Fee</td>
                    <td>{procFee}</td>
                    <td>
                      <Button
                        className="badge mx-1"
                        variant="info"
                        onClick={() => handleTransactions("procFee")}
                      >
                        Transactions
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Interest on FTM Loans</td>
                    <td>{interest}</td>
                    <td>
                      <Button
                        className="badge mx-1"
                        variant="info"
                        onClick={() => handleTransactions("loanUsers")}
                      >
                        View Users
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={7} style={{ "overflow-x": "auto" }}>
          <div className="my-3" style={{ color: "orange" }}>
            <h2>{transactionTitle}</h2>
          </div>
          {transactions.length > 0 ? (
            transactionTitle === "Total Transactions" ? (
              <Table
                responsive
                className="table table-hover"
                size="sm"
                style={{ maxHeight: "400px", overflow: "auto" }}
              >
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Email</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>ProcessingFee</th>
                    <th>Type</th>
                    <th>TransactionDate</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((x) => {
                    return (
                      <tr>
                        <td>{x.Symbol}</td>
                        <td>{x.Email}</td>
                        <td>{parseFloat(x.Price).toFixed(2)}</td>
                        <td>{x.Quantity}</td>
                        <td>{x.ProcessingFee}</td>
                        <td>{x.Type}</td>
                        <td>{x.TransactionDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <Table
                responsive
                className="table table-hover"
                size="sm"
                style={{ maxHeight: "400px", overflow: "auto" }}
              >
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Collateral</th>
                    <th>Loan</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((x) => {
                    return (
                      <tr>
                        <td>{x.Email}</td>
                        <td>{parseFloat(x.Collateral).toFixed(2)} FTM</td>
                        <td>{parseFloat(x.Loan).toFixed(2)} FTM</td>
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

export default Earnings;

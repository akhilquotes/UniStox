import React, { useState, useEffect } from "react";
import { Col, Row, Table, Card, Button } from "react-bootstrap";
import { useRapyd } from "../../context/RapydContext";
import { useFantom } from "../../context/FantomContext";
import { useFirestore } from "../../context/FirestoreContext";
import TransactionTable from "./TransactionTable";

const Equity = ({ user }) => {
  const { listWallets, getWalletTransactions } = useRapyd();
  const { getFantomPrice } = useFantom();
  const { getDocuments } = useFirestore();
  const [transactions, setTransactions] = useState([]);
  const [transactionTitle, setTransactionTitle] = useState("Transactions");
  const [equityBal, setEquityBal] = useState();
  const [debtBal, setDebtBal] = useState();

  const handleTransactions = (type) => {
    if (type == "equity") {
      setTransactionTitle("Total Transactions");
      getWalletTransactions(user.RapydAcc.ewallet_id, "").then((x) =>
        setTransactions(x.body.data)
      );
    } else if (type == "debt") {
      setTransactionTitle("Debt Transactions");
      getDocuments("", "DebtTransactions", "destination_transaction_id").then(
        (docs) => {
          setTransactions(docs);
        }
      );
    }
  };
  useEffect(() => {
    listWallets(
      user.RapydAcc.ewallet_reference_id,
      user.Email === "johndoe2@gmail.com" ? "company" : "person"
    ).then((x) => {
      const walletObj = { ...x.body.data[0] };
      let acnts = [...walletObj.accounts];
      let balance = 0;
      acnts.forEach((acc) => {
        if (acc.currency === "USD") {
          balance += acc.balance;
        } else {
          getFantomPrice(acc.currency, "USD").then((res) => {
            balance += acc.balance * parseFloat(res.rate.toFixed(2));
            setEquityBal(balance.toFixed(2));
          });
        }
      });
    });
    getDocuments("", "DebtTransactions", "destination_transaction_id").then(
      (docs) => {
        let debt = 0;
        docs.forEach((doc) => {
          if (doc.currency_code === "USD") {
            debt += doc.amount;
          } else {
            getFantomPrice(doc.currency_code, "USD").then((res) => {
              debt += doc.amount * parseFloat(res.rate.toFixed(2));
              setDebtBal(debt.toFixed(2));
            });
          }
        });
      }
    );
  }, [user]);

  return (
    <>
      <Row className="mt-3">
        <Col xs={5}>
          <Card className="tblCard">
            <Card.Header style={{ color: "orange" }}>
              <h3>Balances</h3>
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
                    <th>Fund Type</th>
                    <th>Amount in USD</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Equity</td>
                    <td>{equityBal}</td>
                    <td>
                      <Button
                        className="badge mx-1"
                        variant="info"
                        onClick={() => handleTransactions("equity")}
                      >
                        Transactions
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Debt</td>
                    <td>{debtBal}</td>
                    <td>
                      <Button
                        className="badge mx-1"
                        variant="info"
                        onClick={() => handleTransactions("debt")}
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
        <Col xs={7} style={{ "overflow-x": "auto" }}>
          <div className="my-3" style={{ color: "orange" }}>
            <h2>{transactionTitle}</h2>
          </div>
          {transactions.length > 0 ? (
            transactionTitle === "Debt Transactions" ? (
              <TransactionTable transactions={transactions} type="debt" />
            ) : (
              <TransactionTable transactions={transactions} type="equity" />
            )
          ) : (
            "No transaction available!"
          )}
        </Col>
      </Row>
    </>
  );
};

export default Equity;

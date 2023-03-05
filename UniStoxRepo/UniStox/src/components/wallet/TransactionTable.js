import React from "react";
import moment from "moment";
import { Table } from "react-bootstrap";
const TransactionTable = ({ transactions, type }) => {
  return (
    <>
      <Table
        responsive
        className="table table-hover"
        size="sm"
        style={{ maxHeight: "400px", overflow: "auto" }}
      >
        <thead>
          <tr>
            <th>Id</th>
            <th>Amount</th>
            <th>Currency</th>
            {type === "equity" && <th>Type</th>}
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((x) => {
            return (
              <tr>
                {type === "equity" ? (
                  <td>{x.id}</td>
                ) : (
                  <td>{x.source_transaction_id}</td>
                )}
                <td>{x.amount}</td>
                {type === "equity" ? (
                  <td>{x.currency}</td>
                ) : (
                  <td>{x.currency_code}</td>
                )}
                {type === "equity" && <td>{x.type}</td>}
                <td>
                  {moment(x.created_at * 1000).format("DD-MM-YYYY h:mm:ss")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default TransactionTable;

import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import StockHistoryChart from "./StockHistoryChart";
import { getStockInfo } from "../Lib/StocksApi";
const StockInfo = ({ stock }) => {
  return (
    <>
      <Row>
        <Col xs={8}>
          <StockHistoryChart stock={stock} />
        </Col>
        <Col>
          <Row style={{ color: "orange" }} className="mb-3">
            <h4>Fundamentals</h4>
          </Row>
          {stock && (
            <>
              <Row>
                <Col xs={6}>Market Cap</Col>
                <Col xs={6}>
                  {" "}
                  {parseFloat(stock.marketcap) / 1000000 +
                    "M " +
                    stock.Currency}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col xs={6}>P/E</Col>
                <Col xs={6}>{stock.pe}</Col>
              </Row>
              <hr />
              <Row>
                <Col xs={6}>CDP Score</Col>
                <Col xs={6}>{stock["CDP Score"]}</Col>
              </Row>
              <hr />
              <Row>
                <Col xs={6}>CO2e</Col>
                <Col xs={6}>{stock["CO2E"]}</Col>
              </Row>
              <hr />
              <Row>
                <Col xs={6}>EPS</Col>
                <Col xs={6}>{stock["eps"]}</Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default StockInfo;

import React, { useEffect, useState } from "react";
import { Row, Col, Table, Card } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import BuyStock from "./BuyStock";
import SellStock from "./SellStock";
import StockInfo from "./StockInfo";
import {
  searchStock,
  getGlobalQuote,
  getFantomHistoricalData,
} from "../Lib/StocksApi";
import { useFirestore } from "../../context/FirestoreContext";
import { useFantom } from "../../context/FantomContext";
import StatusCard from "./StatusCard";
import StockPerformanceChart from "./StockPerformanceChart";
import FantomHistoryChart from "./FantomHistoryChart";
import LoanVsCollateralChart from "./LoanVsCollateralChart";

const Portfolio = ({
  user,
  portfolio,
  setPortfolio,
  ftmBalance,
  setFtmBalance,
  loan,
}) => {
  const SYMBOL_PREFIX = "gp_ltp_";
  const [isLoading, setIsLoading] = useState(false);
  //const [options, setOptions] = useState([]);
  const [timeoutFlag, setTimeoutFlag] = useState(false);
  const [show, setShow] = useState(false);
  const [stock, setStock] = useState({});
  const [stockInfoTab, setStockInfoTab] = useState(0);
  const [globalQuote, setGlobalQuote] = useState({});
  const [card1Val, setCard1val] = useState("");
  const [card2Val, setCard2val] = useState("");
  const [card3Val, setCard3val] = useState("");
  const { addDocument, getDocuments } = useFirestore();
  const { getFantomPrice } = useFantom();
  const [stockPerfData, setStockPerfData] = useState([]);
  const [stockHistData, setStockHistData] = useState([]);
  const [loanAmount, setLoanAmount] = useState(0);
  //const [gcData, setGcData] = useState([]);
  const handleClose = () => {
    setShow(false);
    setStockInfoTab(0);
  };

  const options = [
    {
      Exchange: "NSE",
      Company: "TECHM",
      "Company Name": "Tech Mahindra",
      price: 1076.7,
      priceopen: 1070,
      high: 1082.9,
      low: 1060,
      volume: 1943246,
      marketcap: 1051430000000,
      tradetime: "11/25/2022 15:30:00",
      datadelay: 0,
      volumeavg: "#N/A",
      pe: "18.04",
      eps: 59.7,
      Currency: "INR",
      "CDP Score": "A",
      AlphaTicker: "TECHM.BSE",
      "CDP Value": 1,
      CO2E: 0.0005,
    },
    {
      Exchange: "NSE",
      Company: "INFY",
      "Company Name": "Infosys",
      price: 1630.05,
      priceopen: 1631.4,
      high: 1644,
      low: 1613.8,
      volume: 4563255,
      marketcap: 85449808407,
      tradetime: "11/25/2022 15:30:00",
      datadelay: 0,
      volumeavg: "#N/A",
      pe: "29.93",
      eps: 54.46,
      Currency: "INR",
      "CDP Score": "A",
      AlphaTicker: "INFY.BSE",
      "CDP Value": 1,
      CO2E: 0.0005,
    },
    {
      Exchange: "NSE",
      Company: "M&M",
      "Company Name": "Mahindra & Mahindra",
      price: 1261,
      priceopen: 1258,
      high: 1267.7,
      low: 1246,
      volume: 1370326,
      marketcap: 1507270000000,
      tradetime: "11/25/2022 15:30:00",
      datadelay: 0,
      volumeavg: "#N/A",
      pe: "15.31",
      eps: 82.37,
      Currency: "INR",
      "CDP Score": "A",
      AlphaTicker: "M&M.BSE",
      "CDP Value": 1,
      CO2E: 0.0005,
    },
    {
      Exchange: "NSE",
      Company: "APOLLOTYRE",
      "Company Name": "Apollo Tyres",
      price: 292.75,
      priceopen: 283.55,
      high: 294.3,
      low: 283.1,
      volume: 5019984,
      marketcap: 185960000000,
      tradetime: "11/25/2022 15:30:00",
      datadelay: 0,
      volumeavg: "#N/A",
      pe: "25.76",
      eps: 11.37,
      Currency: "INR",
      "CDP Score": "D",
      AlphaTicker: "APOLLOTYRE.BSE",
      "CDP Value": 7,
      CO2E: 0.0035,
    },
    {
      Exchange: "NSE",
      Company: "ARVIND",
      "Company Name": "Arvind Ltd",
      price: 93.35,
      priceopen: 92.15,
      high: 93.75,
      low: 92.15,
      volume: 412684,
      marketcap: 24354781226,
      tradetime: "11/25/2022 15:30:00",
      datadelay: 0,
      volumeavg: "#N/A",
      pe: "6.09",
      eps: 15.32,
      Currency: "INR",
      "CDP Score": "B-",
      AlphaTicker: "ARVIND.BSE",
      "CDP Value": 4,
      CO2E: 0.002,
    },
    {
      Exchange: "NSE",
      Company: "BHARTIARTL",
      "Company Name": "Bharati Airtel",
      price: 847.5,
      priceopen: 852,
      high: 860,
      low: 841.6,
      volume: 2991065,
      marketcap: 4895770000000,
      tradetime: "11/25/2022 15:30:00",
      datadelay: 0,
      volumeavg: "#N/A",
      pe: "73",
      eps: 11.61,
      Currency: "INR",
      "CDP Score": "C",
      AlphaTicker: "BHARTIARTL.BSE",
      "CDP Value": 5,
      CO2E: 0.0025,
    },
    {
      Exchange: "NSE",
      Company: "AXISBANK",
      "Company Name": "Axis Bank",
      price: 887,
      priceopen: 883,
      high: 891.8,
      low: 880.9,
      volume: 7614047,
      marketcap: 2727160000000,
      tradetime: "11/25/2022 15:30:00",
      datadelay: 0,
      volumeavg: "#N/A",
      pe: "14.88",
      eps: 59.6,
      Currency: "INR",
      "CDP Score": "B-",
      AlphaTicker: "AXISBANK.BSE",
      "CDP Value": 4,
      CO2E: 0.002,
    },
    {
      Exchange: "NSE",
      Company: "BPCL",
      "Company Name": "Bharath Petroleum Corporation",
      price: 323.6,
      priceopen: 321,
      high: 326.25,
      low: 316.4,
      volume: 4296778,
      marketcap: 704033000000,
      tradetime: "11/25/2022 15:30:01",
      datadelay: 0,
      volumeavg: "#N/A",
      pe: "#N/A",
      eps: -4.13,
      Currency: "INR",
      "CDP Score": "B-",
      AlphaTicker: "BPCL.BSE",
      "CDP Value": 4,
      CO2E: 0.002,
    },
    {
      Exchange: "NSE",
      Company: "DIVISLAB",
      "Company Name": "Divi's Laboratories",
      price: 3344,
      priceopen: 3294,
      high: 3347,
      low: 3276,
      volume: 385136,
      marketcap: 885578000000,
      tradetime: "11/25/2022 15:30:00",
      datadelay: 0,
      volumeavg: "#N/A",
      pe: "29.66",
      eps: 112.73,
      Currency: "INR",
      "CDP Score": "F",
      AlphaTicker: "DIVISLAB.BSE",
      "CDP Value": 9,
      CO2E: 0.0045,
    },
    {
      Exchange: "NSE",
      Company: "DRREDDY",
      "Company Name": "Dr. Reddy's Laboratories",
      price: 4414,
      priceopen: 4423.85,
      high: 4434.95,
      low: 4389,
      volume: 295409,
      marketcap: 9010181704,
      tradetime: "11/25/2022 15:30:00",
      datadelay: 0,
      volumeavg: "#N/A",
      pe: "23.61",
      eps: 186.93,
      Currency: "INR",
      "CDP Score": "B",
      AlphaTicker: "DRREDDY.BSE",
      "CDP Value": 3,
      CO2E: 0.0015,
    },
    {
      Exchange: "NYSE",
      Company: "MO",
      "Company Name": "Altria Group, Inc.",
      price: 44.74,
      priceopen: 45,
      high: 45.15,
      low: 44.65,
      volume: 2734811,
      marketcap: 80181778288,
      tradetime: "11/25/2022 13:02:08",
      datadelay: 0,
      volumeavg: "8326632",
      pe: "17.38",
      eps: 2.57,
      Currency: "USD",
      "CDP Score": "A",
      AlphaTicker: "MO",
      "CDP Value": 1,
      CO2E: 0.0005,
    },
    {
      Exchange: "NYSE",
      Company: "AVB",
      "Company Name": "AvalonBay Communities",
      price: 170.06,
      priceopen: 169.24,
      high: 170.24,
      low: 169.12,
      volume: 220012,
      marketcap: 23790934496,
      tradetime: "11/25/2022 13:00:50",
      datadelay: 0,
      volumeavg: "927428",
      pe: "19.38",
      eps: 8.78,
      Currency: "USD",
      "CDP Score": "A",
      AlphaTicker: "AVB",
      "CDP Value": 1,
      CO2E: 0.0005,
    },
    {
      Exchange: "NYSE",
      Company: "BBY",
      "Company Name": "Best Buy Co., Inc.",
      price: 81.23,
      priceopen: 82.25,
      high: 83.29,
      low: 81.1,
      volume: 2343631,
      marketcap: 18287375639,
      tradetime: "11/25/2022 13:00:02",
      datadelay: 0,
      volumeavg: "3350116",
      pe: "12.13",
      eps: 6.7,
      Currency: "USD",
      "CDP Score": "A",
      AlphaTicker: "BBY",
      "CDP Value": 1,
      CO2E: 0.0005,
    },
    {
      Exchange: "NYSE",
      Company: "BK",
      "Company Name": "BNY Mellon",
      price: 45.67,
      priceopen: 45.52,
      high: 45.85,
      low: 45.4,
      volume: 1146691,
      marketcap: 36914146119,
      tradetime: "11/25/2022 13:00:31",
      datadelay: 0,
      volumeavg: "5662626",
      pe: "13.91",
      eps: 3.28,
      Currency: "USD",
      "CDP Score": "A",
      AlphaTicker: "BK",
      "CDP Value": 1,
      CO2E: 0.0005,
    },
    {
      Exchange: "NYSE",
      Company: "CL",
      "Company Name": "Colgate Palmolive Company",
      price: 76.77,
      priceopen: 77.13,
      high: 77.23,
      low: 76.66,
      volume: 1388825,
      marketcap: 64119391330,
      tradetime: "11/25/2022 13:00:02",
      datadelay: 0,
      volumeavg: "4304743",
      pe: "33.48",
      eps: 2.29,
      Currency: "USD",
      "CDP Score": "A",
      AlphaTicker: "CL",
      "CDP Value": 1,
      CO2E: 0.0005,
    },
    {
      Exchange: "NYSE",
      Company: "MMM",
      "Company Name": "3M Company",
      price: 129.04,
      priceopen: 128.88,
      high: 129.82,
      low: 128.52,
      volume: 882383,
      marketcap: 71325927200,
      tradetime: "11/25/2022 13:02:02",
      datadelay: 0,
      volumeavg: "2963854",
      pe: "11.25",
      eps: 11.47,
      Currency: "USD",
      "CDP Score": "B",
      AlphaTicker: "MMM",
      "CDP Value": 3,
      CO2E: 0.0015,
    },
    {
      Exchange: "NYSE",
      Company: "ANF",
      "Company Name": "Abercrombie & Fitch Co.",
      price: 23.77,
      priceopen: 24.21,
      high: 24.51,
      low: 23.7,
      volume: 1527966,
      marketcap: 1175512570,
      tradetime: "11/25/2022 13:00:01",
      datadelay: 0,
      volumeavg: "1692030",
      pe: "19.41",
      eps: 1.22,
      Currency: "USD",
      "CDP Score": "C",
      AlphaTicker: "ANF",
      "CDP Value": 5,
      CO2E: 0.0025,
    },
    {
      Exchange: "NYSE",
      Company: "ABT",
      "Company Name": "Abbott Laboratories",
      price: 106.96,
      priceopen: 106.67,
      high: 107.35,
      low: 106.51,
      volume: 2558110,
      marketcap: 186493000000,
      tradetime: "11/25/2022 13:02:55",
      datadelay: 0,
      volumeavg: "6509377",
      pe: "24.03",
      eps: 4.45,
      Currency: "USD",
      "CDP Score": "B",
      AlphaTicker: "ABT",
      "CDP Value": 3,
      CO2E: 0.0015,
    },
    {
      Exchange: "NASDAQ",
      Company: "ADBE",
      "Company Name": "Adobe",
      price: 334.3,
      priceopen: 332.89,
      high: 335.51,
      low: 332.01,
      volume: 1197767,
      marketcap: 155416000000,
      tradetime: "11/25/2022 13:05:00",
      datadelay: 0,
      volumeavg: "3768778",
      pe: "32.96",
      eps: 10.14,
      Currency: "USD",
      "CDP Score": "A-",
      AlphaTicker: "ADBE",
      "CDP Value": 2,
      CO2E: 0.001,
    },
    {
      Exchange: "NYSE",
      Company: "ALK",
      "Company Name": "Alaska Air Group",
      price: 46.9,
      priceopen: 46.25,
      high: 47.22,
      low: 46.25,
      volume: 484320,
      marketcap: 5948693013,
      tradetime: "11/25/2022 13:00:01",
      datadelay: 0,
      volumeavg: "1531998",
      pe: "115.89",
      eps: 0.4,
      Currency: "USD",
      "CDP Score": "C",
      AlphaTicker: "ALK",
      "CDP Value": 5,
      CO2E: 0.0025,
    },
    {
      Exchange: "NASDAQ",
      Company: "AAL",
      "Company Name": "American Airlines Group Inc",
      price: 14.5,
      priceopen: 14.4,
      high: 14.7,
      low: 14.35,
      volume: 9903925,
      marketcap: 9423561600,
      tradetime: "11/25/2022 13:05:00",
      datadelay: 0,
      volumeavg: "31293728",
      pe: "#N/A",
      eps: -2.52,
      Currency: "USD",
      "CDP Score": "A-",
      AlphaTicker: "AAL",
      "CDP Value": 2,
      CO2E: 0.001,
    },
    {
      Exchange: "NYSE",
      Company: "AXP",
      "Company Name": "American Express",
      price: 154.15,
      priceopen: 153.52,
      high: 154.47,
      low: 153.17,
      volume: 665794,
      marketcap: 115186000000,
      tradetime: "11/25/2022 13:02:33",
      datadelay: 0,
      volumeavg: "3531139",
      pe: "15.49",
      eps: 9.95,
      Currency: "USD",
      "CDP Score": "A-",
      AlphaTicker: "AXP",
      "CDP Value": 2,
      CO2E: 0.001,
    },
    {
      Exchange: "NYSE",
      Company: "WHR",
      "Company Name": "Whirlpool Corporation",
      price: 148.77,
      priceopen: 147.79,
      high: 149.77,
      low: 147.79,
      volume: 189977,
      marketcap: 8104744362,
      tradetime: "11/25/2022 13:02:19",
      datadelay: 0,
      volumeavg: "964637",
      pe: "24.33",
      eps: 6.11,
      Currency: "USD",
      "CDP Score": "C",
      AlphaTicker: "WHR",
      "CDP Value": 5,
      CO2E: 0.0025,
    },
    {
      Exchange: "NASDAQ",
      Company: "WDAY",
      "Company Name": "Workday, Inc",
      price: 148.98,
      priceopen: 147.84,
      high: 149.74,
      low: 147.4,
      volume: 768302,
      marketcap: 38138878906,
      tradetime: "11/25/2022 13:05:00",
      datadelay: 0,
      volumeavg: "2226971",
      pe: "#N/A",
      eps: -0.78,
      Currency: "USD",
      "CDP Score": "B",
      AlphaTicker: "WDAY",
      "CDP Value": 3,
      CO2E: 0.0015,
    },
    {
      Exchange: "NYSE",
      Company: "VZ",
      "Company Name": "Verizon Communications Inc.",
      price: 39.02,
      priceopen: 39.1,
      high: 39.36,
      low: 38.97,
      volume: 7725741,
      marketcap: 163877000000,
      tradetime: "11/25/2022 13:00:01",
      datadelay: 0,
      volumeavg: "24317003",
      pe: "8.48",
      eps: 4.6,
      Currency: "USD",
      "CDP Score": "B",
      AlphaTicker: "VZ",
      "CDP Value": 3,
      CO2E: 0.0015,
    },
    {
      Exchange: "NYSE",
      Company: "VMW",
      "Company Name": "VMware, Inc",
      price: 119.26,
      priceopen: 119.68,
      high: 119.87,
      low: 119.05,
      volume: 451526,
      marketcap: 50622889406,
      tradetime: "11/25/2022 13:00:01",
      datadelay: 0,
      volumeavg: "990213",
      pe: "35.95",
      eps: 3.32,
      Currency: "USD",
      "CDP Score": "B",
      AlphaTicker: "VMW",
      "CDP Value": 3,
      CO2E: 0.0015,
    },
    {
      Exchange: "NYSE",
      Company: "X",
      "Company Name": "United States Steel Corporation",
      price: 25.85,
      priceopen: 25.85,
      high: 26.26,
      low: 25.77,
      volume: 4112801,
      marketcap: 6055851154,
      tradetime: "11/25/2022 13:00:01",
      datadelay: 0,
      volumeavg: "9603737",
      pe: "2.15",
      eps: 12.02,
      Currency: "USD",
      "CDP Score": "C",
      AlphaTicker: "X",
      "CDP Value": 5,
      CO2E: 0.0025,
    },
    {
      Exchange: "NYSE",
      Company: "DIS",
      "Company Name": "The Walt Disney Company",
      price: 98.87,
      priceopen: 98.81,
      high: 99.81,
      low: 98.08,
      volume: 6664281,
      marketcap: 180246000000,
      tradetime: "11/25/2022 13:02:06",
      datadelay: 0,
      volumeavg: "16452415",
      pe: "56.57",
      eps: 1.75,
      Currency: "USD",
      "CDP Score": "B",
      AlphaTicker: "DIS",
      "CDP Value": 3,
      CO2E: 0.0015,
    },
    {
      Exchange: "NYSE",
      Company: "TDC",
      "Company Name": "Teradata Corp.",
      price: 33.42,
      priceopen: 32.95,
      high: 33.51,
      low: 32.86,
      volume: 350905,
      marketcap: 3402155813,
      tradetime: "11/25/2022 13:00:01",
      datadelay: 0,
      volumeavg: "1213819",
      pe: "50.4",
      eps: 0.66,
      Currency: "USD",
      "CDP Score": "D",
      AlphaTicker: "TDC",
      "CDP Value": 7,
      CO2E: 0.0035,
    },
  ];

  const groupPortfolio = (data) => {
    var result = [];
    data.reduce((res, val) => {
      if (!res[val.Symbol]) {
        //const closePrice = await getLatestPrice(val.Symbol);
        res[val.Symbol] = {
          Symbol: val.Symbol,
          CompanyName: val.CompanyName,
          Currency: val.Currency,
          CO2E: val.CO2E,
          Quantity: val.Quantity,
          TotalCost: val.Quantity * parseFloat(val.Price),
          Gains: 0,
        };
        result.push(res[val.Symbol]);
      } else {
        res[val.Symbol].Quantity += val.Quantity;
        res[val.Symbol].TotalCost +=
          parseInt(val.Quantity) * parseFloat(val.Price);
      }
      return res;
    }, {});
    return result;
  };

  const getStockPerformanceChartData = () => {
    var result = [];
    for (let stock of portfolio) {
      if (result.filter((x) => x.Date === stock.TransactionDate).length === 0) {
        let reqStocks = portfolio.filter(
          (x) => new Date(x.TransactionDate) <= new Date(stock.TransactionDate)
        );
        let reqPrice = 0;
        for (let s of reqStocks) {
          // let rate = localStorage.getItem(SYMBOL_PREFIX + s.Symbol)
          //   ? parseFloat(
          //       JSON.parse(localStorage.getItem(SYMBOL_PREFIX + s.Symbol)).rate
          //     )
          //   : "";
          // let multiplier = parseFloat(rate);
          let costOfStocks = parseInt(s.Quantity) * parseFloat(s.Price);
          reqPrice += costOfStocks;
        }
        let obj = {
          Date: stock.TransactionDate,
          Value: parseFloat(reqPrice.toFixed(3)),
        };
        result.push(obj);
      }
    }
    setStockPerfData(result);
  };

  const getStockHistory = () => {
    getFantomHistoricalData()
      .then((resp) => resp.json())
      .then((item) => {
        const data = item["prices"];
        setStockHistData(data);
      });
  };

  const getTotalStocks = (data) => {
    let total = 0;
    data.forEach((x) => (total += parseInt(x.Quantity)));
    return total;
  };

  const getTotalCost = (data) => {
    let total = 0;
    data.forEach((x) => (total += parseFloat(x.TotalCost)));
    return total;
  };

  const getLoanWorth = () => {
    let amt = 0;
    loan.forEach((doc) => {
      amt += parseFloat(doc.Amount);
      setLoanAmount(parseFloat(amt.toFixed(2)));
    });
  };

  useEffect(() => {
    fetchAndSetStockPrice();
    getTotalGains();
    getStockPerformanceChartData();
    getStockHistory();
    getLoanWorth();
  }, [portfolio, timeoutFlag, loan]);

  const getTotalGains = () => {
    debugger;
    const grpData = groupPortfolio(portfolio);
    const stockLength = grpData.length;
    let totalChange = 0;
    let totalPercentChange = 0;
    let totalValue = 0;
    for (let data of grpData) {
      let ltp = localStorage.getItem(SYMBOL_PREFIX + data.Symbol)
        ? parseFloat(
            JSON.parse(localStorage.getItem(SYMBOL_PREFIX + data.Symbol)).price
          )
        : "";
      let rate = localStorage.getItem(SYMBOL_PREFIX + data.Symbol)
        ? parseFloat(
            JSON.parse(localStorage.getItem(SYMBOL_PREFIX + data.Symbol)).rate
          )
        : "";
      totalValue += data.TotalCost;
      let change = ltp * data.Quantity - data.TotalCost;
      let perStockChange = change / data.TotalCost;
      let weightage = data.TotalCost / getTotalCost(grpData);
      let percentChange = perStockChange * weightage;
      totalPercentChange += percentChange;
      let multiplier = parseFloat(rate);
      console.log("multiplier", multiplier);
      totalChange += data.TotalCost * perStockChange * multiplier;
    }
    setCard1val((totalPercentChange * 100).toFixed(2));
    setCard2val(totalChange.toFixed(3) + " FTM");
    setCard3val(totalValue.toFixed(2) + " FTM");
  };

  const fetchAndSetStockPrice = () => {
    console.log("entered fetch price");
    setTimeoutFlag(false);
    let date = new Date();
    let symbolSet = new Set();
    portfolio.forEach((item, index) => {
      symbolSet.add(item.Symbol);
    });
    let curDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;
    for (let data of symbolSet) {
      if (localStorage.getItem(SYMBOL_PREFIX + data)) {
        let tickObject = JSON.parse(localStorage.getItem(SYMBOL_PREFIX + data));
        if (tickObject.date !== curDate) {
          getLatestPrice(data).then(
            function (price) {
              let tickCurrency = portfolio.filter((x) => x.Symbol === data)[0]
                .Currency;
              getFantomPrice(tickCurrency, "FTM").then((res) => {
                let ftmPrice =
                  parseFloat(res.rate.toFixed(2)) * parseFloat(price);
                let tickObject = {
                  date: curDate,
                  price: ftmPrice.toFixed(2),
                  rate: res.rate,
                };
                localStorage.setItem(
                  SYMBOL_PREFIX + data,
                  JSON.stringify(tickObject)
                );
              });
            },
            (item) => {
              if (!timeoutFlag) {
                setTimeout(function () {
                  fetchAndSetStockPrice();
                }, 1000 * 90);
                setTimeoutFlag(true);
              } else {
              }
            }
          );
        }
      } else {
        getLatestPrice(data).then(
          function (price) {
            let tickCurrency = portfolio.filter((x) => x.Symbol === data)[0]
              .Currency;
            getFantomPrice(tickCurrency, "FTM").then((res) => {
              let ftmPrice =
                parseFloat(res.rate.toFixed(5)) * parseFloat(price);
              console.log("ftm", ftmPrice);
              let tickObject = {
                date: curDate,
                price: ftmPrice.toFixed(2),
                rate: res.rate,
              };
              localStorage.setItem(
                SYMBOL_PREFIX + data,
                JSON.stringify(tickObject)
              );
            });
          },
          (item) => {
            if (!timeoutFlag) {
              setTimeout(function () {
                fetchAndSetStockPrice();
              }, 1000 * 90);
              setTimeoutFlag(true);
            } else {
            }
          }
        );
      }
    }
  };

  const getLatestPrice = async (ticker) => {
    const data = await getGlobalQuote(ticker);
    const item = await data.json();
    if (item.Note) {
      Promise.reject(item);
    }
    return item["Global Quote"]["08. previous close"];
  };

  const handleInputSelect = (item) => {
    if (item.length > 0) {
      setStock(item[0]);
      setShow(true);
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {stock["AlphaTicker"]} - {stock["Company Name"]}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {stockInfoTab === 0 && <StockInfo stock={stock} />}
          {stockInfoTab === 1 && (
            <BuyStock
              stock={stock}
              user={user}
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              ftmBalance={ftmBalance}
              setFtmBalance={setFtmBalance}
            />
          )}
          {stockInfoTab === 2 && (
            <SellStock
              stock={stock}
              user={user}
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              ftmBalance={ftmBalance}
              setFtmBalance={setFtmBalance}
              loanAmount={loanAmount}
              portfolioVal={card3Val}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          {stockInfoTab === 0 && (
            <>
              <Button variant="primary" onClick={() => setStockInfoTab(1)}>
                Buy
              </Button>
              <Button variant="danger" onClick={() => setStockInfoTab(2)}>
                Sell
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      <Row>
        <Col xs={8}>
          <Row>
            <Col xs={4}>
              <StatusCard
                bgColor="bg-warning"
                title="Total Gain/Loss (%)"
                text={card1Val + " %"}
                textColor={
                  parseFloat(card1Val) > 0 ? "text-success" : "text-danger"
                }
              />
            </Col>
            <Col xs={4}>
              <StatusCard
                bgColor="bg-warning"
                title="Total Gain/Loss"
                text={card2Val}
                textColor={
                  parseFloat(card2Val) > 0 ? "text-success" : "text-danger"
                }
              />
            </Col>
            <Col xs={4}>
              <StatusCard
                bgColor="bg-warning"
                title="Portfolio Value"
                text={card3Val}
                textColor={
                  parseFloat(card3Val) > 0 ? "text-success" : "text-danger"
                }
              />
            </Col>
          </Row>
        </Col>
        <Col xs={4}>
          <Row className="justify-content-center">
            <Col className="m-3">
              <Typeahead
                id="basic-example"
                labelKey="Company Name"
                minLength={2}
                onChange={handleInputSelect}
                options={options}
                placeholder="Search Company"
                renderMenuItemChildren={(option) => (
                  <>
                    <b>
                      <span>{option["AlphaTicker"]}</span>&nbsp;-&nbsp;
                    </b>
                    <span>{option["Company Name"]}</span>
                  </>
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col xs={4}>
          <StockPerformanceChart
            perfData={stockPerfData}
            keyCol="Value"
            title="Portfolio Performance"
            series="Value"
            color="#447dd4"
          />
        </Col>
        <Col xs={4}>
          <FantomHistoryChart />
        </Col>
        <Col xs={4}>
          <LoanVsCollateralChart loanAmount={loanAmount} portfolio={card3Val} />
        </Col>
      </Row>
      <Row>
        <Row>
          <Col>
            {portfolio.length > 0 ? (
              <>
                <Card className="tblCard border-light">
                  <Card.Header
                    className="card-title  bg-transparent text-warning"
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.5em",
                    }}
                  >
                    My Portfolio
                  </Card.Header>
                  <Card.Body>
                    <Table style={{ marginBottom: "0" }} responsive size="sm">
                      <thead>
                        <tr>
                          <th>Company</th>
                          <th>Symbol</th>
                          <th>Units</th>
                          <th>Weightage</th>
                          {/* <th>Tx Price</th> */}
                          <th>Growth</th>
                          <th>Last Traded Price</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody className="table-group-divider">
                        {groupPortfolio(portfolio)
                          .filter((x) => x.Quantity > 0)
                          .map((x) => {
                            return (
                              <tr>
                                <td>{x.CompanyName}</td>
                                <td>{x.Symbol}</td>
                                <td>{x.Quantity}</td>
                                <td>
                                  {(
                                    (parseFloat(x.TotalCost) /
                                      getTotalCost(groupPortfolio(portfolio))) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </td>
                                {/* <td>{x.Price} FTM</td> */}
                                <td>
                                  {localStorage.getItem(
                                    SYMBOL_PREFIX + x.Symbol
                                  ) &&
                                    (
                                      ((parseFloat(
                                        JSON.parse(
                                          localStorage.getItem(
                                            SYMBOL_PREFIX + x.Symbol
                                          )
                                        ).price
                                      ) *
                                        x.Quantity -
                                        x.TotalCost) /
                                        x.TotalCost) *
                                      100
                                    ).toFixed(2)}
                                  %
                                </td>
                                <td>
                                  {localStorage.getItem(
                                    SYMBOL_PREFIX + x.Symbol
                                  ) &&
                                    parseFloat(
                                      JSON.parse(
                                        localStorage.getItem(
                                          SYMBOL_PREFIX + x.Symbol
                                        )
                                      ).price
                                    ).toFixed(2)}{" "}
                                  FTM
                                </td>
                                <td>
                                  <Button
                                    className="badge mx-1"
                                    variant="info"
                                    onClick={() => {
                                      //setStock(x);
                                      let rqStock = options.filter(
                                        (y) => y.AlphaTicker == x.Symbol
                                      )[0];
                                      setStock(rqStock);
                                      setShow(true);
                                    }}
                                  >
                                    Execute
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </>
            ) : (
              "No stocks Available"
            )}
          </Col>
        </Row>
      </Row>
    </>
  );
};

export default Portfolio;

//Alphavantage api to get stocks information
const baseUrl = "https://www.alphavantage.co/query?apikey=9CNTM0OD3ES0536N";

//Get stock information like currency, last traded price..
const getStockInfo = (symbol) => {
  const url = baseUrl + "&function=OVERVIEW&symbol=" + symbol;
  return fetch(url);
};

//Get list of stocks based on search keyword
const searchStock = (query) => {
  const url = baseUrl + "&function=SYMBOL_SEARCH&keywords=" + query;
  return fetch(url);
};

//Get monthly timeseries data of stock
const getMonthlySeries = (symbol) => {
  const url =
    baseUrl + "&function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=" + symbol;
  return fetch(url);
};

//Get daily timeseries data of stock
const getDailySeries = (symbol) => {
  const url = baseUrl + "&function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + symbol;
  return fetch(url);
};

const getGlobalQuote = (symbol) => {
  const url = baseUrl + "&function=GLOBAL_QUOTE&symbol=" + symbol;
  return fetch(url);
};

const getFantomHistoricalData = () => {
  const url =
    "https://api.coingecko.com/api/v3/coins/fantom/market_chart?vs_currency=usd&days=max&interval=daily";
  return fetch(url);
};

export {
  getStockInfo,
  searchStock,
  getMonthlySeries,
  getDailySeries,
  getGlobalQuote,
  getFantomHistoricalData,
};

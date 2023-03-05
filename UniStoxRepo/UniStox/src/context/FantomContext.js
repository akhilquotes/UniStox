import { createContext, useContext } from "react";

const fantomContext = createContext();
const host = "http://localhost:5000";

export function FantomContextProvider({ children }) {
  //Create Fantom wallet for user
  async function createEthereumWallet() {
    try {
      const response = await fetch(`${host}/fantom/createEthereumWallet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  //get exchange rate of FTM vs any base currency(USD, INR..)
  async function getFantomPrice(baseCurrency, destCurrency) {
    try {
      const response = await fetch(
        `${host}/fantom/getFantomPrice?baseCurrency=${baseCurrency}&destCurrency=${destCurrency}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  //get Fantom wallet balance using Fantom Testnet Scan API
  async function getBalance(address) {
    try {
      const response = await fetch(
        `${host}/fantom/getBalance?address=${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.text();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  //get all transactions of Fantom wallet using Fantom Testnet Scan API
  async function listAddressTransactions(address) {
    try {
      const response = await fetch(
        `${host}/fantom/listAddressTransactions?address=${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  //get all internal transactions of Fantom wallet using Fantom Testnet Scan API
  async function listInternalTransactions(address) {
    try {
      const response = await fetch(
        `${host}/fantom/listInternalTransactions?address=${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  //Send FTM from company wallet to user wallet when user sells stock/buy FTM from currency
  async function sendFTMFromContractToAddress(address, amount) {
    try {
      const response = await fetch(
        `${host}/fantom/sendFTMFromContractToAddress?address=${address}&amount=${amount}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  //Send FTM from user wallet to company wallet when user buys stock
  async function deposit(address, amount, privateKey) {
    try {
      const response = await fetch(
        `${host}/fantom/deposit?address=${address}&amount=${amount}&privateKey=${privateKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  return (
    <fantomContext.Provider
      value={{
        createEthereumWallet,
        getFantomPrice,
        sendFTMFromContractToAddress,
        deposit,
        getBalance,
        listAddressTransactions,
        listInternalTransactions,
      }}
    >
      {children}
    </fantomContext.Provider>
  );
}

export function useFantom() {
  return useContext(fantomContext);
}

import { createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
//const imageToBase64 = require("image-to-base64");

const rapydContext = createContext();
const host = "http://localhost:5000";
const companyWallet = "ewallet_27021412f97decbf784b6dc0f3cdd6f7"; //"ewallet_0c713d827b7767085f558a2331f1587e";
const exchangeWallet = "ewallet_1ce81a3aab4c7e3f5494d80be1ab6ead";
const bankWallet = "ewallet_853df5e6401790870aad3d6a7652859c";

export function RapydContextProvider({ children }) {
  function getFormattedDate(cdate) {
    var date = new Date(cdate);
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }
  //create user wallet
  async function createWallet(user) {
    try {
      const body = {
        first_name: user.FirstName,
        last_name: user.LastName,
        ewallet_reference_id: `${user.FirstName}-${user.LastName}-${uuidv4()}`,
        metadata: {
          merchant_defined: true,
        },
        type: "person",
        contact: {
          phone_number: user.Mobile,
          email: user.Email,
          first_name: user.FirstName,
          last_name: user.LastName,
          mothers_name: "",
          contact_type: "personal",
          address: {
            name: `${user.FirstName}-${user.LastName}`,
            line_1: user.Address,
            line_2: "",
            line_3: "",
            city: "Anytown",
            state: "",
            country: user.Country,
            zip: "",
            phone_number: user.Mobile,
            metadata: {},
            canton: "",
            district: "",
          },
          date_of_birth: getFormattedDate(user.DOB),
          country: user.Country,
          metadata: {
            merchant_defined: true,
          },
        },
      };
      const response = await fetch(`${host}/rapyd/createWallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
      //alert(data);
    } catch (e) {
      alert("Error " + e);
    }
  }
  //createCheckout for user to add funds to wallet
  async function createPayout(
    user,
    beneficiary,
    senderCurrency,
    beneCurrency,
    bankName,
    payoutMethod,
    amount
  ) {
    try {
      const body = {
        beneficiary: beneficiary,
        beneficiary_country: beneficiary.nationality,
        beneficiary_entity_type: "individual",
        description: "Payout - Bank Transfer: Beneficiary/Sender objects",
        merchant_reference_id: "GHY-0YU-HUJ-POI",
        ewallet: user.RapydAcc.ewallet_id,
        sender_amount: amount,
        payout_currency: beneCurrency,
        payout_method_type: payoutMethod,
        confirm_automatically: false,
        sender: {
          ...beneficiary,
          address: "India",
          city: "Anytown",
          date_of_birth: getFormattedDate(user.DOB),
          remitter_account_type: "Individual",
          purpose_code: "investment_income",
          occupation: "Engineer",
          source_of_income: "salary",
          beneficiary_relationship: "self",
        },
        sender_country: user.Country,
        sender_currency: senderCurrency,
        sender_entity_type: "individual",
        metadata: {
          merchant_defined: true,
        },
      };
      const response = await fetch(`${host}/rapyd/createPayout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
      //alert(data);
    } catch (e) {
      alert("Error " + e);
    }
  }
  //Confirm payout hook
  async function confirmPayout(payoutId) {
    try {
      const body = {
        payoutId: payoutId,
      };
      const response = await fetch(`${host}/rapyd/confirmPayout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
      //alert(data);
    } catch (e) {
      alert("Error " + e);
    }
  }
  //To verify KYC of user based on nationality
  async function verifyIdentity(
    country,
    docType,
    ewallet,
    file_front,
    file_back,
    contact_id
  ) {
    try {
      const file_front_str = file_front.split(",");
      const file_back_str = file_back.split(",");
      const body = {
        country: country,
        document_type: docType,
        ewallet: ewallet,
        contact: contact_id,
        face_image: file_front_str[1],
        face_image_mime_type: file_front_str[0].split(";")[0].split(":")[1],
        front_side_image: file_front_str[1],
        front_side_image_mime_type: file_front_str[0]
          .split(";")[0]
          .split(":")[1],
        back_side_image: file_back_str[1],
        back_side_image_mime_type: file_back_str[0].split(";")[0].split(":")[1],
        reference_id: "success_" + uuidv4().substring(0, 20),
      };
      const response = await fetch(`${host}/rapyd/verifyIdentity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
      //alert(data);
    } catch (e) {
      alert("Error " + e);
    }
  }
  //Add funds to wallet
  async function addFundsToWallet(ewallet, amount, currency) {
    try {
      const body = {
        ewallet: ewallet,
        amount: String(amount),
        currency: currency,
        metadata: {
          merchant_defined: true,
        },
      };
      const response = await fetch(`${host}/rapyd/addFundsToWallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  //Get user wallet balance
  async function getWalletBalance(ewallet) {
    try {
      const response = await fetch(
        `${host}/rapyd/getWalletBalance?ewallet=${ewallet}`,
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
  //Get list of documents required for user verification
  async function getListOfDocs(con) {
    try {
      const response = await fetch(
        `${host}/rapyd/getListOfDocs?country=` + con,
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
  //Get list of countries
  async function listCountries() {
    try {
      const response = await fetch(`${host}/rapyd/listCountries`, {
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
  //Get list of currencies
  async function listCurrencies() {
    try {
      const response = await fetch(`${host}/rapyd/listCurrencies`, {
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
  //Get user wallet transactions for particular currency
  async function getWalletTransactions(ewallet, currency) {
    try {
      const response = await fetch(
        `${host}/rapyd/getWalletTransactions?ewallet=${ewallet}&currency=${currency}`,
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
  //List all currency wallets of user
  async function listWallets(walletReferenceId, type) {
    try {
      const response = await fetch(
        `${host}/rapyd/listWallets?type=${type}&walletReferenceId=${walletReferenceId}`,
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
  //List contacts of user
  async function listContacts(walletId) {
    try {
      const response = await fetch(
        `${host}/rapyd/listContacts?walletId=${walletId}`,
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
  //Create payments checkout page for user based on currency
  async function createCheckoutPage(amount, country, currency, ewallet_id) {
    try {
      const body = {
        amount: amount,
        complete_payment_url:
          "http://13.230.186.196:5000/mywallet?message=success", //"http://13.230.186.196:5000/mywallet",
        country: country,
        currency: currency,
        error_payment_url:
          "http://13.230.186.196:5000/mywallet?message=failure", //"http://13.230.186.196:5000/mywallet",
        ewallet: ewallet_id,
        language: "en",
        metadata: {
          merchant_defined: true,
        },
        payment_method_type_categories: ["bank_transfer", "card", "ewallet"],
      };
      const response = await fetch(`${host}/rapyd/createCheckoutPage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  //Transfer amount between wallets based on currency
  async function walletTransfer(source_ewallet, amount, currency, type) {
    try {
      const src_wallet = type === "buy" ? source_ewallet : companyWallet;
      const dest_wallet = type === "buy" ? companyWallet : source_ewallet;
      const body = {
        source_ewallet: src_wallet,
        destination_ewallet: dest_wallet,
        amount: amount,
        currency: currency,
      };
      console.log(body);
      const response = await fetch(`${host}/rapyd/walletTransfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  //Transfer amount from company wallet to stock exchange wallet when user buys stock
  async function walletExchangeTransfer(amount, currency, type) {
    try {
      const src_wallet = type === "buy" ? companyWallet : exchangeWallet;
      const dest_wallet = type === "buy" ? exchangeWallet : companyWallet;
      const body = {
        source_ewallet: src_wallet,
        destination_ewallet: dest_wallet,
        amount: amount,
        currency: currency,
      };
      console.log(body);
      const response = await fetch(`${host}/rapyd/walletTransfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }

  //Transfer amount from global bank to company wallet incase of shortfall
  async function bankToCompanyTransfer(amount, currency) {
    try {
      const src_wallet = bankWallet;
      const dest_wallet = companyWallet;
      const body = {
        source_ewallet: src_wallet,
        destination_ewallet: dest_wallet,
        amount: amount,
        currency: currency,
      };
      console.log(body);
      const response = await fetch(`${host}/rapyd/walletTransfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Error " + e);
    }
  }
  return (
    <rapydContext.Provider
      value={{
        createWallet,
        addFundsToWallet,
        getWalletBalance,
        getListOfDocs,
        getWalletTransactions,
        listWallets,
        createCheckoutPage,
        walletTransfer,
        walletExchangeTransfer,
        bankToCompanyTransfer,
        createPayout,
        confirmPayout,
        verifyIdentity,
        listCountries,
        listCurrencies,
        listContacts,
      }}
    >
      {children}
    </rapydContext.Provider>
  );
}

export function useRapyd() {
  return useContext(rapydContext);
}

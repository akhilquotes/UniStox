const express = require("express");
const router = express.Router();

const makeRequest = require("./utilities").makeRequest;

router.post("/createWallet", async (req, res) => {
  try {
    const body = req.body;
    const result = await makeRequest("POST", "/v1/user", body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/addFundsToWallet", async (req, res) => {
  try {
    const body = req.body;
    const result = await makeRequest("POST", "/v1/account/deposit", body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/getWalletBalance", async (req, res) => {
  try {
    const wallet = req.query.ewallet;
    const result = await makeRequest("GET", "/v1/user/" + wallet + "/accounts");
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/getListOfDocs", async (req, res) => {
  try {
    const country = req.query.country;
    const result = await makeRequest(
      "GET",
      "/v1/identities/types?country=" + country
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/getWalletTransactions", async (req, res) => {
  try {
    const ewallet = req.query.ewallet;
    const currency = req.query.currency;
    let url = "";
    if (currency != "") {
      url = "/v1/user/" + ewallet + "/transactions?currency=" + currency;
    } else {
      url = "/v1/user/" + ewallet + "/transactions";
    }
    const result = await makeRequest("GET", url);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/listWallets", async (req, res) => {
  try {
    const ewalletRefId = req.query.walletReferenceId;
    const type = req.query.type;
    const result = await makeRequest(
      "GET",
      `/v1/user/wallets/?type=${type}&ewallet_reference_id=${ewalletRefId}`
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/listContacts", async (req, res) => {
  try {
    const ewalletId = req.query.walletId;
    const result = await makeRequest(
      "GET",
      "/v1/ewallets/" + ewalletId + "/contacts"
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/listCountries", async (req, res) => {
  try {
    const result = await makeRequest("GET", "/v1/data/countries");
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/listCurrencies", async (req, res) => {
  try {
    const result = await makeRequest("GET", "/v1/data/currencies");
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/createCheckoutPage", async (req, res) => {
  try {
    const body = req.body;
    const result = await makeRequest("POST", "/v1/checkout", body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/walletTransfer", async (req, res) => {
  try {
    const body = req.body;
    const result = await makeRequest("POST", "/v1/account/transfer", body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/createPayout", async (req, res) => {
  try {
    const body = req.body;
    const result = await makeRequest("POST", "/v1/payouts", body);
    //console.log(result);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/confirmPayout", async (req, res) => {
  try {
    const payoutId = req.body.payoutId;
    const body = {};
    const result = await makeRequest(
      "POST",
      "/v1/payouts/confirm/" + payoutId,
      body
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/verifyIdentity", async (req, res) => {
  try {
    const body = req.body;
    const result = await makeRequest("POST", "/v1/identities", body);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/webhooks", async (req, res) => {
  try {
    const lbody = req.body;
    let result = null;
    if (req.body.type === "TRANSFER_FUNDS_BETWEEN_EWALLETS_CREATED") {
      const body = {
        id: req.body.data.id,
        metadata: {
          merchant_defined: "accepted",
        },
        status: "accept",
      };
      result = await makeRequest("POST", "/v1/account/transfer/response", body);
    } else if (req.body.type === "TRANSFER_FUNDS_BETWEEN_EWALLETS_RESPONSE") {
      result = req.body;
    } else if (req.body.type === "PAYOUT_CREATED") {
      let lresult = req.body;
      const payoutId = lresult.body.data.id;
      const payoutAmount = lresult.body.data.amount;
      const body = {};
      const presult = await makeRequest(
        "POST",
        "/v1/payouts/complete/" + payoutId + "/" + payoutAmount,
        body
      );
      result = presult;
    } else if (req.body.type === "PAYOUT_COMPLETED") {
      result = req.body;
    } else if (req.body.type === "IDENTITY_VERIFICATION") {
      result = req.body;
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

module.exports = router;

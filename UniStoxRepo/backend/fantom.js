const express = require("express");
const router = express.Router();
const Web3 = require("web3");
const https = require("https");
const log = false;

//var web3 = new Web3("https://rpc.testnet.fantom.network");

//Connect Web3 provider to Fantom testnet
var web3 = new Web3("https://xapi.testnet.fantom.network/lachesis/");

//API key of Fantam Testnet Scan
const ftmTestScanApiKey = "ZPETAF2KZJS6DY1EFVAKIGGXFD7WY68KP1";

//Smart Contract ABI
const fantomWalletContractAbi = [
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "destAddr",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "destAddr",
        type: "address",
      },
    ],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const fantomWalletContractByteCode =
  "608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506104d4806100606000396000f3fe6080604052600436106100495760003560e01c8062f714ce1461004e5780636f9fb98a1461008b5780638da5cb5b146100b6578063d0e30db0146100e1578063f8b2cb4f146100eb575b600080fd5b34801561005a57600080fd5b50610075600480360381019061007091906102f2565b610128565b604051610082919061034d565b60405180910390f35b34801561009757600080fd5b506100a061020a565b6040516100ad9190610377565b60405180910390f35b3480156100c257600080fd5b506100cb610212565b6040516100d891906103b3565b60405180910390f35b6100e9610236565b005b3480156100f757600080fd5b50610112600480360381019061010d91906103ce565b610238565b60405161011f9190610377565b60405180910390f35b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146101b9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101b09061047e565b60405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc849081150290604051600060405180830381858888f193505050501580156101ff573d6000803e3d6000fd5b506001905092915050565b600047905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b600080fd5b6000819050919050565b6102718161025e565b811461027c57600080fd5b50565b60008135905061028e81610268565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006102bf82610294565b9050919050565b6102cf816102b4565b81146102da57600080fd5b50565b6000813590506102ec816102c6565b92915050565b6000806040838503121561030957610308610259565b5b60006103178582860161027f565b9250506020610328858286016102dd565b9150509250929050565b60008115159050919050565b61034781610332565b82525050565b6000602082019050610362600083018461033e565b92915050565b6103718161025e565b82525050565b600060208201905061038c6000830184610368565b92915050565b600061039d82610294565b9050919050565b6103ad81610392565b82525050565b60006020820190506103c860008301846103a4565b92915050565b6000602082840312156103e4576103e3610259565b5b60006103f2848285016102dd565b91505092915050565b600082825260208201905092915050565b7f4f6e6c7920746865206f776e65722063616e2063616c6c2074686973206d657460008201527f686f640000000000000000000000000000000000000000000000000000000000602082015250565b60006104686023836103fb565b91506104738261040c565b604082019050919050565b600060208201905081810360008301526104978161045b565b905091905056fea2646970667358221220eb9f0d2f2767082de25e97022f9c2d62537720959079c74e847656db23e6098764736f6c63430008110033";

//Smart Contract Address deployed to Fantom Testnet
const fantomWalletContractAddress =
  "0xF0B87B6965b66FEfb32c03De4782FeB12d364C0C";

const contractOwnerAddress = "0x15d248eb6175D225E834CC0Bb41009512DFBa25f";
const contractOwnerPrivateKey =
  "1708582ae389dd9e8786840c3b4a2f70b91c66edb5cae3faacd25299adfafdb1";

const account = web3.eth.accounts.privateKeyToAccount(
  "0x" + contractOwnerPrivateKey
);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

//Create Fantom wallet for user
router.get("/createEthereumWallet", async (req, res) => {
  try {
    var ethaccount = web3.eth.accounts.create();
    const transaction = {
      from: contractOwnerAddress,
      to: ethaccount.address,
      gas: 50000,
      chainId: 4002,
      value: 2,
    };
    const signature = await web3.eth.accounts.signTransaction(
      transaction,
      contractOwnerPrivateKey
    );
    const resp = await web3.eth.sendSignedTransaction(signature.rawTransaction);
    const receipt = await web3.eth.getTransactionReceipt(resp.transactionHash);
    return res.status(200).json(ethaccount);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

//Deploy smart contract
router.get("/deployContract", async (req, res) => {
  try {
    let deployContract = new web3.eth.Contract(fantomWalletContractAbi);
    let tx = deployContract.deploy({
      data: fantomWalletContractByteCode,
    });
    const transaction = {
      from: contractOwnerAddress,
      gas: 50000,
      data: tx.encodeABI(),
    };
    const signature = await web3.eth.accounts.signTransaction(
      transaction,
      contractOwnerPrivateKey
    );
    const resp = await web3.eth.sendSignedTransaction(signature.rawTransaction);

    // let tx = deployContract.deploy({
    //   data: fantomWalletContractByteCode,
    // });
    // const gas = await tx.estimateGas({ from: contractOwnerAddress });
    // const gasPrice = await web3.eth.getGasPrice();
    // const data = tx.encodeABI();
    // const nonce = await web3.eth.getTransactionCount(contractOwnerAddress);
    // var options = { data, gas, gasPrice, nonce, chainId: 0xfa2 };
    // const signedTx = await web3.eth.accounts.signTransaction(
    //   options,
    //   contractOwnerPrivateKey
    // );
    // const receipt = await web3.eth.sendSignedTransaction(
    //   signedTx.rawTransaction
    // );
    return res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//Fetch smart contract balance by connecting to contract using web3
router.get("/getContractBalance", async (req, res) => {
  try {
    const contract = new web3.eth.Contract(
      fantomWalletContractAbi,
      fantomWalletContractAddress
    );
    var balance = await contract.methods.getContractBalance().call();
    return res.status(200).json(web3.utils.fromWei(balance, "ether"));
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json(error);
  }
});

//Fetch FTM wallet balance by connecting to contract using web3
router.get("/getAddressBalance", async (req, res) => {
  try {
    const contract = new web3.eth.Contract(
      fantomWalletContractAbi,
      fantomWalletContractAddress
      //{ from: contractOwnerAddress }
    );
    const address = req.query.address;
    var balance = await contract.methods.getBalance(address).call();
    return res.status(200).json(web3.utils.fromWei(balance, "ether"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//Send FTM from user wallet to contract when user buys stock
router.get("/deposit", async (req, res) => {
  try {
    const contract = new web3.eth.Contract(
      fantomWalletContractAbi,
      fantomWalletContractAddress
    );
    const address = req.query.address;
    const amount = req.query.amount;
    const privateKey = req.query.privateKey;
    const transaction = {
      from: address,
      to: fantomWalletContractAddress,
      gas: 50000,
      data: contract.methods.deposit().encodeABI(),
      value: web3.utils.toWei(String(amount), "ether"),
    };
    const signature = await web3.eth.accounts.signTransaction(
      transaction,
      privateKey
    );
    const resp = await web3.eth.sendSignedTransaction(signature.rawTransaction);
    const receipt = await web3.eth.getTransactionReceipt(resp.transactionHash);
    return res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json(error);
  }
});

//Send FTM from contract to user wallet when user sells stock/buy FTM from currency
router.get("/sendFTMFromContractToAddress", async (req, res) => {
  try {
    const contract = new web3.eth.Contract(
      fantomWalletContractAbi,
      fantomWalletContractAddress
    );
    const address = req.query.address;
    const amount = req.query.amount;
    const transaction = {
      from: contractOwnerAddress,
      to: fantomWalletContractAddress,
      gas: 50000,
      chainId: 4002,
      data: contract.methods
        .withdraw(web3.utils.toWei(String(amount), "ether"), address)
        .encodeABI(),
    };
    const signature = await web3.eth.accounts.signTransaction(
      transaction,
      contractOwnerPrivateKey
    );
    const resp = await web3.eth.sendSignedTransaction(signature.rawTransaction);
    const receipt = await web3.eth.getTransactionReceipt(resp.transactionHash);

    return res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json(error);
  }
});

//get all transactions of Fantom wallet using Fantom Testnet Scan API
router.get("/listAddressTransactions", async (req, res) => {
  try {
    const address = req.query.address;
    let response = await makeRequest(
      "api-testnet.ftmscan.com",
      "GET",
      `/api?apikey=${ftmTestScanApiKey}&module=account&action=txlist&address=${address}&sort=desc`
    );
    let data = response.body.result.map((x) => ({
      ...x,
      value: web3.utils.fromWei(x.value, "ether"),
    }));
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//get all internal transactions of Fantom wallet using Fantom Testnet Scan API
router.get("/listInternalTransactions", async (req, res) => {
  try {
    const address = req.query.address;
    let response = await makeRequest(
      "api-testnet.ftmscan.com",
      "GET",
      `/api?apikey=${ftmTestScanApiKey}&module=account&action=txlistinternal&address=${address}&sort=desc`
    );
    let data = response.body.result.map((x) => ({
      ...x,
      value: web3.utils.fromWei(x.value, "ether"),
    }));
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//get Fantom wallet balance using Fantom Testnet Scan API
router.get("/getBalance", async (req, res) => {
  try {
    const address = req.query.address;
    let response = await makeRequest(
      "api-testnet.ftmscan.com",
      "GET",
      `/api?apikey=${ftmTestScanApiKey}&module=account&action=balance&address=${address}&sort=desc`
    );
    return res
      .status(200)
      .json(web3.utils.fromWei(response.body.result, "ether"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//get exchange rate of FTM vs any base currency(USD, INR..) using CoinAPI
router.get("/getFantomPrice", async (req, res) => {
  try {
    const base_currency = req.query.baseCurrency;
    const dest_currency = req.query.destCurrency;
    var options = {
      method: "GET",
      hostname: "rest.coinapi.io",
      path: `/v1/exchangerate/${base_currency}/${dest_currency}`,
      headers: { "X-CoinAPI-Key": "69291BE9-4BF6-4C06-92AB-E1C698DE5B68" },
    };
    var response = await httpRequest(options, null, log);
    return res.status(200).json(response.body);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//Utility function to make http request
async function makeRequest(baseUrl, method, urlPath, body = null) {
  try {
    httpMethod = method;
    httpBaseURL = baseUrl;
    httpURLPath = urlPath;
    const options = {
      hostname: httpBaseURL,
      port: 443,
      path: httpURLPath,
      method: httpMethod,
      headers: {
        "Content-Type": "application/json",
      },
    };
    return await httpRequest(options, body, log);
  } catch (error) {
    console.error("Error generating request options");
    throw error;
  }
}

//Utility function to make http request
async function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    try {
      let bodyString = "";
      if (body) {
        bodyString = JSON.stringify(body);
        bodyString = bodyString == "{}" ? "" : bodyString;
      }

      log && console.log(`httpRequest options: ${JSON.stringify(options)}`);
      const req = https.request(options, (res) => {
        let response = {
          statusCode: res.statusCode,
          headers: res.headers,
          body: "",
        };

        res.on("data", (data) => {
          response.body += data;
        });

        res.on("end", () => {
          console.log(response.body);
          response.body = response.body ? JSON.parse(response.body) : {};
          log &&
            console.log(`httpRequest response: ${JSON.stringify(response)}`);

          if (response.statusCode !== 200) {
            return reject(response);
          }

          return resolve(response);
        });
      });

      req.on("error", (error) => {
        return reject(error);
      });

      req.write(bodyString);
      req.end();
    } catch (err) {
      return reject(err);
    }
  });
}
module.exports = router;

var Web3 = require('web3');
var fs = require('fs')
var Tx = require('ethereumjs-tx')
var abi = JSON.parse(fs.readFileSync('./build/contracts/SecureBlocksTokenFaucet.json').toString()).abi;
var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/5TrRzKbx3R5Opo3RDMp6'));
// var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// let contractAddress = JSON.parse(fs.readFileSync('./build/contracts/SecureBlocksTokenFaucet.json').toString()).networks[15].address;
let contractAddress = JSON.parse(fs.readFileSync('./build/contracts/SecureBlocksTokenFaucet.json').toString()).networks[3].address;
let token = new web3.eth.Contract(abi, contractAddress);
let accounts;
let toAddress;
let fromAddress;

async function executeApp() {
  accounts = await web3.eth.getAccounts();
  
  // toAddress = accounts[4];
  // fromAddress = accounts[0];
  fromAddress = '0x37dd47bb0ed2d8ae0e6ac17935316fc8f75b75da';
  toAddress = '0x37e1411f518226a7e1b4e8eb8bb0e0e9f7f86580';
  await getTokens();
};

async function getTokens() {
  var count = await web3.eth.getTransactionCount(fromAddress);
   
    var raw_tx = {
        from: fromAddress,
        nonce: web3.utils.toHex(parseInt(count)),
        gasPrice: "0x9D21DBA00",
        gasLimit: "0x47B760",
        to: contractAddress, //Contract Address
        value: "0x0",
        data: token.methods.getTokens(1000000, fromAddress).encodeABI(),
    };

    var tx = new Tx(raw_tx);
    var privKey = new Buffer('/*PRIVATE KEY*/', 'hex');
    tx.sign(privKey);
    var serializedTx = tx.serialize();

    await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .on('receipt', function(receipt){
      console.log(`
      Congratulations! The transaction was successfully completed.
      Review it on Etherscan.
      TxHash: ${receipt.transactionHash}\n`
    );
    });

  //   await token.methods.getTokens(1000000, fromAddress).send({from : fromAddress})
  //   .on('transactionHash', function(hash) {
  //     console.log(`
  //     Congratulations! The transaction was successfully completed.
  //     `);
  //   }).on('receipt', function(receipt) {
  //     console.log(`
  //     Congratulations! The transaction was successfully completed.
  //     Review it on Etherscan.
  //     TxHash: ${receipt.transactionHash}\n`
  //   );
  // });
  await getBalance();
};


async function getBalance() {
  await token.methods.balanceOf(fromAddress).call({ from: fromAddress}, function(error, result){
    if(error) {
      console.log(error);
    } else {
      console.log(`Balance of your account is:${result}`);
    }
  });
  await sendToken();
};


async function sendToken() {
    var count = await web3.eth.getTransactionCount(fromAddress);
   
    var raw_tx = {
        from: fromAddress,
        nonce: web3.utils.toHex(count),
        gasPrice: "0x9D21DBA00",
        gasLimit: "0x47B760",
        to: contractAddress, //Contract Address
        value: "0x0",
        data: token.methods.transfer(toAddress, 100).encodeABI(),
    };

    var tx = new Tx(raw_tx);
    var privKey = new Buffer('/*PRIVATE KEY*/', 'hex');
    tx.sign(privKey);
    var serializedTx = tx.serialize();

    await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .on('receipt', function(receipt){
      console.log(`
      Congratulations! The transaction was successfully completed.
      Review it on Etherscan.
      TxHash: ${receipt.transactionHash}\n`
    );
    });
};


executeApp();


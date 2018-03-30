var Web3 = require('web3');
var fs = require('fs')
var Tx = require('ethereumjs-tx')
var abi = JSON.parse(fs.readFileSync('./build/contracts/SecureBlocksTokenFaucet.json').toString()).abi;
// var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/5TrRzKbx3R5Opo3RDMp6'));
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

let contractAddress = JSON.parse(fs.readFileSync('./build/contracts/SecureBlocksTokenFaucet.json').toString()).networks[15].address;
let token = new web3.eth.Contract(abi, contractAddress);
let accounts;
let toAddress;
let fromAddress;

async function executeApp() {
  accounts = await web3.eth.getAccounts();
  toAddress = accounts[4];
  fromAddress = accounts[0];
  await getTokens();
};

async function getTokens() {
    await token.methods.getTokens(1000000, fromAddress).send({from : fromAddress})
    .on('transactionHash', function(hash) {
      console.log(`
      Congratulations! The transaction was successfully completed.
      `);
    }).on('receipt', function(receipt) {
      console.log(`
      Congratulations! The transaction was successfully completed.
      Review it on Etherscan.
      TxHash: ${receipt.transactionHash}\n`
    );
  });
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
    var privKey = new Buffer('2841f7bf02cceafde6e87f18bded8c2accaf58be0c40f5ab38e559255b78c42f', 'hex');
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


var request = require('request');

// should change this url to variably change depending on specs of contract.
var url = "https://api.infura.io/v1/jsonrpc/mainnet/eth_getLogs?params=%5B%7B%22address%22%3A%220x27f706edde3aD952EF647Dd67E24e38CD0803DD6%22%2C%22fromBlock%22%3A%220x0%22%2C%22toBlock%22%3A%220x3D0900%22%2C%22topics%22%3A%5B%5D%7D%5D"
var url2 = "https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0x6dC896e52DeF34fF23Ab0B07250e12B9Fd9fe9E7&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&apikey=YourApiKeyToken"
var d = {}

// calling infura
request(url2, function (error, response, body) {
  if (!error && response.statusCode == 200) {

    var json = JSON.parse(body);
    var txs = json.result;

    txs.forEach(function(tx){
      var topics = tx.topics;
      var tth    = topics[0];
      var from   = removePadding(topics[1]);
      var to     = removePadding(topics[2]);
      var data   = tx.data;

      parseTx(to,from,data);
    });

    console.log(d)

  }
})

// this is some test data so I don't have to make the call each time.
// var txs =
// [
// { 'address': '0x27f706edde3ad952ef647dd67e24e38cd0803dd6',
//     'topics':
//      [ '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//        '0x27f706edde3ad952ef647dd67e24e38cd0803dd6',
//        '0x1f24b1b0d4121317e427fd0149ee5207d54a7a62' ],
//     'data': '0x000000000000000000000002a1b9ff11c4e76c00',
//     'blockNumber': '0x3cb3a8',
//     'transactionHash': '0x9b073a510393895bcfbc3c0ebfb4c339d428821dd1951a62fcd576f738ac6084',
//     'transactionIndex': '0x8',
//     'blockHash': '0x9f35e6bb370cc6f48718af037167fbd002bcc7e94b893f746e78d73a23af7c18',
//     'logIndex': '0x4',
//     'removed': false },
//   { 'address': '0x27f706edde3ad952ef647dd67e24e38cd0803dd6',
//     'topics':
//      [ '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//        '0x27f706edde3ad952ef647dd67e24e38cd0803dd6',
//        '0x1f24b1b0d4121317e427fd0149ee5207d54a7a62' ],
//     'data': '0x000000000000000000000002a1dd860434a86c00',
//     'blockNumber': '0x3cb3a8',
//     'transactionHash': '0x9323f4eb919747a7a174ff9500fb2b5a321f1889f334234c985aef187c29683c',
//     'transactionIndex': '0x55',
//     'blockHash': '0x9f35e6bb370cc6f48718af037167fbd002bcc7e94b893f746e78d73a23af7c18',
//     'logIndex': '0x29',
//     'removed': false },
//   ]
  //
  // txs.forEach(function(tx){
  //   var topics = tx.topics;
  //   var tth    = topics[0];
  //   var from   = topics[1];
  //   var to     = topics[2];
  //   var data   = tx.data;
  //
  //   parseTx(to,from,data);
  // });


function removePadding(s){
  // """
  // removes zero padding from addresses
  // params: s - a string with zero padding
  // """
  return s.substring(0,2) + s.substring(26,66);
}

function hexToDec(s){
  /*
   * converts a hex base number to decimal base number
   * params: s - a string representation of hex number
   */
  return parseInt(s,16);
}

function removeDecimal(s,d){
  return s/(Math.pow(10,d))
}

function parseTx(t,f,data){
  // """
  // parses the tx and updates balance data structure
  // params: t - to address
  //         f - from address
  //         d - tx data
  // """

  // should feed in decimal amount parameter
  var amt = removeDecimal(hexToDec(data),18);

  if(!(t in d)){
    if(!(f in d)){
      d[t] = amt;
      d[f] = -amt; // would this ever happen? who starts with supply? Comes from contract address?
    }
    else{
      d[t] = amt;
      d[f] -= amt;
    }
  }
  else{
    if(!(f in d)){
      d[t] += amt;
      d[f] = -amt;
    }
    else{
      d[t] += amt;
      d[f] -= amt;
    }
  }
}

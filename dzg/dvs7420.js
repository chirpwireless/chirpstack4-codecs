// Decode uplink function.
//
// Input is an object with the following fields:
// - bytes = Byte array containing the uplink payload, e.g. [255, 230, 255, 0]
// - fPort = Uplink fPort.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - data = Object representing the decoded payload.
function decodeUplink(input) {
  return {data: Decode(input.fPort, input.bytes)};
}

function toHexString(bytes) {
    return bytes.map(function(byte) { return ("00" + (byte & 0xFF).toString(16)).slice(-2);}).join('');
}

function fromHex(s) {
  return parseInt('0x'+s.match(/../g).reverse().join(''));
}

function Decode(fPort, bytes) {
  var tohex = toHexString(bytes);				

  if (tohex.slice(0, 2) == "01"){
    var fails = fromHex(tohex.slice(4, 6));
    var uptime = fromHex(tohex.slice(14, 22));
    var utc = fromHex(tohex.slice(22, 30));
    var devs = fromHex(tohex.slice(46, 48));
    return {
      status: "lora-plugin",
      uptime: uptime,
      utc: utc,
      devices: devs,
      failures: fails
    };
  }
  
  var header = tohex.slice(0,6);
     
  if (header == "0004a2" || header == "0003a2"){
    var id = fromHex(tohex.slice(6, 14));
    var utc = fromHex(tohex.slice(14, 22));
    var ch1 = fromHex(tohex.slice(22, 30));
    var ch2 = fromHex(tohex.slice(30, 38));
    var ch3 = fromHex(tohex.slice(38, 46));
    return {
      energy_1: ch1/100,
      energy_2: ch2/100,
      energy_3: ch3/100,
      meter_id: id,
      utc_time: utc
    };
  }

  return {
    error: "undeciphered",
  };
}

// Encode downlink function.
//
// Input is an object with the following fields:
// - data = Object representing the payload that must be encoded.
// - variables = Object containing the configured device variables.
//
// Output must be an object with the following fields:
// - bytes = Byte array containing the downlink payload.
function encodeDownlink(input) {
  return {
    data: [225, 230, 255, 0]
  };
}

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
  return { data: Decode(input.fPort, input.bytes) };
}

function Decode(fPort, bytes) {
  var errFlag = false
  var ptr = 0;
  var res = {};
  while (ptr < bytes.length && !errFlag) {
    var fieldType = bytes[ptr++];
    switch (fieldType) {
      case 1:
        res.temperature = (bytes[ptr] * 256 + bytes[ptr+1]) / 10;
        ptr += 2;
        break;
      case 2:
        res.humidity = bytes[ptr++];
        break;
      case 3:
        res.acceleration = bytes[ptr] + ':' + bytes[ptr + 1] + ':' + bytes[ptr + 2];
        ptr += 3;
        break;
      case 7:
        res.battery_level = bytes[ptr] * 256 + bytes[ptr + 1];
        ptr += 2;
        break;
      case 11:
        res.counter = ((bytes[ptr] * 256 + bytes[ptr + 1]) * 256 + bytes[ptr + 2]) * 256 + bytes[ptr + 3];
        ptr += 4;
        break;
      case 13:
        res.ext_btn = bytes[ptr++];
        res.closed = (res.ext_btn == 1);
        break;
      case 15:
        res.motion = bytes[ptr++];
        break;
      case 18:
        res.water = bytes[ptr++];
        break;
      default:
        errFlag = true;
    }
  }
  return res;
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

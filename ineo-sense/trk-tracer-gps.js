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
  var frameCode = input.bytes[0];
  var res = {frameCode: frameCode};
  if (frameCode == 0x69) { // standard frame
    res.temp = input.bytes[3];
    res.lat = float32FromBytes(input.bytes, 17);
    res.lon = float32FromBytes(input.bytes, 21);
    res.latitude = res.lat;
    res.longitude = res.lon;
    res.koterberg = Math.hypot((res.lat - 51.85533), (res.lon - 9.32534)*Math.cos(res.lat * Math.PI / 180))*111.3;
  }
  res.battery_level = 3300;
  return {data: res};
}

function float32FromBytes(bytes, offset) {
  var x = 0;
  for (var i = 0; i < 4; i++) {
    x = x * 256 + bytes[i + offset];
  }
  return (1+(x & 0x7FFFFF)/Math.pow(2,23))*Math.pow(2, (x>>23)-127);
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

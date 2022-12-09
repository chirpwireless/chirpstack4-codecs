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

function Decode(fPort, bytes) {
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // VOLTAGE
        if (channel_id === 0x03 && channel_type === 0x74) {
            decoded.voltage = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }
	// ACTIVE POWER
        else if (channel_id === 0x04 && channel_type === 0x80) {
            decoded.power = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // POWER FACTOR
        else if (channel_id === 0x05 && channel_type === 0x81) {
            decoded.factor = bytes[i];
            i += 1;
        }
        // POWER CONSUMPTION
        else if (channel_id === 0x06 && channel_type == 0x83) {
            decoded.power_sum = readUInt32LE(bytes.slice(i, i + 4));
            i += 4;
        }
        // CURRENT
        else if (channel_id === 0x07 && channel_type == 0xc9) {
            decoded.current = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
        // STATE
        else if (channel_id === 0x08 && channel_type == 0x70) {
            decoded.state = bytes[i] == 1 || bytes[i] == 0x11? "ON" : "OFF";
            i += 1;
        } 
	else if (channel_id === 0xFF && channel_type == 0x3F) {
            decoded.outage = bytes[i] == 0xFF ? 1 : 0;
        } else {
            break;
        }
    }
    return decoded;
}

function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readUInt32LE(bytes) {
    var value =
        (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return value & 0xffffffff;
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

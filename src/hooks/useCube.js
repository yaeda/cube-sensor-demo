import { useState, useRef } from "react";

const SERVICE_UUID = "10B20100-5B3B-4571-9508-CF3EFCD7BBAE".toLowerCase();
const CHARACTERISTIC_SENSOR_UUID = "10B20106-5B3B-4571-9508-CF3EFCD7BBAE".toLowerCase();
const CHARACTERISTIC_CONFIG_UUID = "10B201FF-5B3B-4571-9508-CF3EFCD7BBAE".toLowerCase();

const getSensorInfo = data => {
  if (data.getUint8(0) === 0x01) {
    if (data.byteLength >= 5) {
      const doubleTap = data.getUint8(3);
      const orientation = data.getUint8(4);
      return { doubleTap: doubleTap, orientation: orientation };
    }
  }
  return null;
};

const getBLEProtocolVersion = data => {
  if (data.getUint8(0) === 0x81) {
    if (data.byteLength >= 3) {
      const decoder = new TextDecoder("utf-8");
      const version = decoder.decode(data.buffer.slice(2));
      return version;
    }
  }
  return null;
};

function useCube() {
  const [connected, setConnected] = useState(false);
  const [orientation, setOrientation] = useState(0);
  const [doubleTap, setDoubleTap] = useState(false);
  const [version, setVersion] = useState("");
  const cubeRef = useRef(null);

  const connect = async () => {
    setConnected(false);
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [SERVICE_UUID] }]
    });
    cubeRef.current = device;
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);
    const characteristics = await service.getCharacteristics();
    for (const char of characteristics) {
      switch (char.uuid.toLowerCase()) {
        case CHARACTERISTIC_SENSOR_UUID:
          await char.startNotifications();
          char.addEventListener("characteristicvaluechanged", event => {
            const sensorInfo = getSensorInfo(event.target.value);
            if (sensorInfo != null) {
              setOrientation(sensorInfo.orientation);
              setDoubleTap(sensorInfo.doubleTap);
            }
          });
          const response = await char.readValue();
          const sensorInfo = getSensorInfo(response);
          if (sensorInfo != null) {
            setOrientation(sensorInfo.orientation);
            setDoubleTap(sensorInfo.doubleTap);
          }
          break;
        case CHARACTERISTIC_CONFIG_UUID:
          await char.startNotifications();
          char.addEventListener("characteristicvaluechanged", event => {
            const version = getBLEProtocolVersion(event.target.value);
            setVersion(version);
          });
          char.writeValue(new Uint8Array([0x01, 0x00]));
          break;
        default:
          break;
      }
    }
    setConnected(true);
  };

  const disconnect = () => {
    if (cubeRef.current !== null) {
      cubeRef.current.gatt.disconnect();
      setConnected(false);
      setOrientation(0);
      setDoubleTap(false);
      setVersion("");
    }
  };

  return [connect, disconnect, connected, orientation, doubleTap, version];
}

export default useCube;

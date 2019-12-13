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

  const connect = () => {
    setConnected(false);
    navigator.bluetooth
      .requestDevice({
        filters: [{ services: [SERVICE_UUID] }]
      })
      .then(device => {
        cubeRef.current = device;
        return device.gatt.connect();
      })
      .then(server => {
        return server.getPrimaryService(SERVICE_UUID);
      })
      .then(service => {
        return service.getCharacteristics();
      })
      .then(characteristics => {
        characteristics.forEach(element => {
          switch (element.uuid.toLowerCase()) {
            case CHARACTERISTIC_SENSOR_UUID:
              const charSensor = element;
              charSensor.startNotifications();
              charSensor.addEventListener(
                "characteristicvaluechanged",
                event => {
                  const sensorInfo = getSensorInfo(event.target.value);
                  if (sensorInfo != null) {
                    setOrientation(sensorInfo.orientation);
                    setDoubleTap(sensorInfo.doubleTap);
                  }
                }
              );
              charSensor.readValue().then(response => {
                const sensorInfo = getSensorInfo(response);
                if (sensorInfo != null) {
                  setOrientation(sensorInfo.orientation);
                  setDoubleTap(sensorInfo.doubleTap);
                }
              });
              break;
            case CHARACTERISTIC_CONFIG_UUID:
              const charConfig = element;
              charConfig.startNotifications();
              charConfig.addEventListener(
                "characteristicvaluechanged",
                event => {
                  const version = getBLEProtocolVersion(event.target.value);
                  setVersion(version);
                }
              );
              charConfig.writeValue(new Uint8Array([0x01, 0x00]));
              break;
            default:
              break;
          }
        });
        setConnected(true);
      });
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

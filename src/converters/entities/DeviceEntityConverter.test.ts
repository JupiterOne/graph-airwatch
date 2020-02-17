import { AirWatchDevice } from "../../airwatch/types";
import {
  DeviceEntity,
  DEVICE_ENTITY_CLASS,
  DEVICE_ENTITY_TYPE,
} from "../../jupiterone/entities/DeviceEntity";
import { createDeviceEntities } from "./DeviceEntityConverter";

test("createDeviceEntities", () => {
  const airwatchDevices: AirWatchDevice[] = [
    {
      Id: {
        Value: 1232,
      },
      Uuid: "device-1",
      SerialNumber: "serial-1",
      MacAddress: "mac-1",
      Imei: "imei-1",
      DeviceFriendlyName: "friendly-1",
      OwnerId: "owner-1",
      UserId: {
        Uuid: "user-1",
        Name: "name-1",
      },
      AssetNumber: "asset-number",
      Platform: "platform",
      Model: "model",
      OperatingSystem: "os",
      WifiSsid: "wifi-ssid",
      IsSupervised: false,
      Username: "username",
    },
  ];

  const result: DeviceEntity[] = createDeviceEntities("host", airwatchDevices);

  expect(result[0]).toStrictEqual({
    _class: DEVICE_ENTITY_CLASS,
    _key: "airwatch-device-id-device-1",
    _type: DEVICE_ENTITY_TYPE,
    _rawData: [{ name: "default", rawData: airwatchDevices[0] }],
    uuid: "device-1",
    serialNumber: "serial-1",
    macAddress: "mac-1",
    imei: "imei-1",
    ownerId: "user-1",
    name: "friendly-1",
    assetNumber: "asset-number",
    platform: "platform",
    model: "model",
    operatingSystem: "os",
    webLink: "https://host/AirWatch/#/AirWatch/Device/Details/Summary/1232",
    wifiSsid: "wifi-ssid",
    isSupervised: false,
    username: "username",
  });
});

import { AirWatchDevice } from "../../airwatch/types";
import {
  DeviceEntity,
  DEVICE_ENTITY_CLASS,
  DEVICE_ENTITY_TYPE,
} from "../../jupiterone/entities/DeviceEntity";

export function createDeviceEntities(
  host: string,
  data: AirWatchDevice[],
): DeviceEntity[] {
  return data.map(item => ({
    _class: DEVICE_ENTITY_CLASS,
    _key: `airwatch-device-id-${item.Uuid}`,
    _type: DEVICE_ENTITY_TYPE,
    _rawData: [{ name: "default", rawData: item }],
    uuid: item.Uuid,
    name: item.DeviceFriendlyName,
    serialNumber: item.SerialNumber,
    macAddress: item.MacAddress,
    imei: item.Imei,
    assetNumber: item.AssetNumber,
    platform: item.Platform,
    model: item.Model,
    operatingSystem: item.OperatingSystem,
    ownerId: item.UserId.Uuid,
    wifiSsid: item.WifiSsid,
    isSupervised: item.IsSupervised,
    username: item.Username,
    webLink: `https://${host}/AirWatch/#/AirWatch/Device/Details/Summary/${item.Id.Value}`,
  }));
}

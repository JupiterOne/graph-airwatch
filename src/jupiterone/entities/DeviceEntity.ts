import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const DEVICE_ENTITY_TYPE = "airwatch_device";
export const DEVICE_ENTITY_CLASS = ["Host", "Device"];

export interface DeviceEntity extends EntityFromIntegration {
  uuid: string;
  name: string;
  serialNumber: string;
  macAddress: string;
  imei: string;
  ownerId: string;
  assetNumber: string;
  platform: string;
  model: string;
  operatingSystem: string;
  wifiSsid: string;
  isSupervised: boolean;
  username: string;
}

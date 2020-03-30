export enum HttpMethod {
  GET = "get",
  POST = "post",
}

export interface AirWatchUser {
  uuid: string;
  name: string;
}

export interface AirWatchDeviceUser {
  Id: {
    Value: number;
  };
  Uuid: string;
  Name: string;
}

export interface AirWatchAdmin {
  uuid: string;
  organizationGroupUuid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
}

export interface AirWatchDevice {
  Id: {
    Value: number;
  };
  Uuid: string;
  SerialNumber: string;
  MacAddress: string;
  Imei: string;
  DeviceFriendlyName: string;
  OwnerId: string;
  AssetNumber: string;
  Platform: string;
  Model: string;
  OperatingSystem: string;
  WifiSsid: string;
  IsSupervised: boolean;
  Username: string;
  UserId: {
    Uuid: string;
    Name: string;
  };
}

export interface AirWatchAccount {
  uuid: string;
  name: string;
}

export interface AirWatchOrganizationGroup {
  Id: number;
  Uuid: string;
  Name: string;
  GroupId: string;
  LocationGroupType: string;
  Country: string;
  WebLink: string;
  CreatedOn: string;
}

export interface Pageable {
  Page: number;
  PageSize: number;
  Total: number;
}

export interface AirWatchAdminsResponse extends Pageable {
  admins: AirWatchAdmin[];
}

export interface AirWatchDevicesResponse extends Pageable {
  Devices: AirWatchDevice[];
}

export interface AirWatchOrganizationGroupsResponse {
  OrganizationGroups: AirWatchOrganizationGroup[];
}

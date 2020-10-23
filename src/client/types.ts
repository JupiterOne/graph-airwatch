export type AirWatchClientConfig = {
  airwatchApiKey: string;
  airwatchUsername: string;
  airwatchPassword: string;
  airwatchHost: string;
};

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

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
  HostName: string;
  Model: string;
  OperatingSystem: string;
  WifiSsid: string;
  IsSupervised: boolean;
  Username: string;
  UserId?: {
    Uuid: string;
    Name: string;
  };
  ComplianceStatus?: string;
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

  /**
   * Organization groups that refer to this group as their
   * `ParentLocationGroup`. Useful for building relationships of groups within
   * groups.
   */
  Children?: AirWatchOrganizationGroupChild[];
}

// /system/groups/{id}/children
export interface AirWatchOrganizationGroupChild {
  Name: string;
  GroupId: string;
  LocationGroupType: string;
  Country: string;
  Locale: string;
  ParentLocationGroup: {
    Id: {
      Value: number;
    };
    Uuid: string;
  };
  CreatedOn: string;
  LgLevel: number;
  Users: string; // number
  Admins: string; // number
  Devices: string; // number
  Id: {
    Value: number;
  };
  Uuid: string;
}

export interface Pageable {
  Page: number;
  PageSize: number;
  Total: number;
}

export interface AirWatchAdminsResponse extends Pageable {
  admins: AirWatchAdmin[];
  Total: number;
}

export interface AirWatchDevicesResponse extends Pageable {
  Devices: AirWatchDevice[];
  Total: number;
}

export interface AirWatchOrganizationGroupsResponse {
  OrganizationGroups: AirWatchOrganizationGroup[];
  TotalResults: number;
}

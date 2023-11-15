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
  UserName: string;
  UserEmailAddress: string;
  UserId?: {
    Uuid: string;
    Name: string;
  };
  ComplianceStatus?: string;
  LastSeen: string;
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

export interface AirwatchProfileResponse {
  profiles: AirwatchProfile[];
  total_count: number;
}
export interface AirwatchProfile {
  uuid: string;
  name: string;
  status: string;
  assignment_type: string;
  managed_by: string;
  organization_group_uuid: string;
  platform: string;
  configuration_type: string;
  context: string;
  assigned_smart_groups: any[];
  excluded_smart_groups: any[];
  configured_payload: ConfiguredPayload[];
  created_by_resource_profile: boolean;
}

export interface ConfiguredPayload {
  name: string;
  display_key: string;
}
export interface AirwatchDeviceProfileResponse {
  DeviceId: DeviceID;
  DeviceProfiles: DeviceProfile[];
  Page: number;
  PageSize: number;
  Total: number;
}

export interface DeviceID {
  Name: string;
  Uuid: string;
}

export interface DeviceProfile {
  Status: number;
  Name: string;
  Description: string;
  LocationGroupId: object;
  CurrentVersion: number;
  AssignmentType: number;
  InstalledProfileVersion: number;
  Id: ID;
  Uuid: string;
}

export interface ID {
  Value: number;
}

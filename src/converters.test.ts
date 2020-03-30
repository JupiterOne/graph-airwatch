import {
  createAccountEntity,
  createAccountRelationships,
  createAdminEntities,
  createDeviceEntities,
  createUserEntities,
  createOrganizationGroupEntities,
  createOrganizationGroupRelationships,
  createDeviceUserRelationships,
} from "./converters";

import {
  AirWatchAccount,
  AirWatchOrganizationGroup,
  AirWatchDevice,
  AirWatchAdmin,
  AirWatchDeviceUser,
} from "./airwatch/types";

import {
  ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
  ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
} from "./jupiterone/relationships/AccountOrganizationGroupRelationship";

import {
  ACCOUNT_DEVICE_RELATIONSHIP_TYPE,
  ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
} from "./jupiterone/relationships/AccountDeviceRelationship";

import { ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE } from "./jupiterone/relationships/OrganizationGroupAdminRelationship";

import { USER_DEVICE_RELATIONSHIP_TYPE } from "./jupiterone/relationships/UserDeviceRelationship";
import {
  ADMIN_ENTITY_CLASS,
  ADMIN_ENTITY_TYPE,
} from "./jupiterone/entities/AdminEntity";
import {
  ACCOUNT_ENTITY_CLASS,
  ACCOUNT_ENTITY_TYPE,
} from "./jupiterone/entities/AccountEntity";
import {
  DEVICE_ENTITY_CLASS,
  DEVICE_ENTITY_TYPE,
} from "./jupiterone/entities/DeviceEntity";
import {
  ORGANIZATION_GROUP_ENTITY_CLASS,
  ORGANIZATION_GROUP_ENTITY_TYPE,
} from "./jupiterone/entities/OrganizationGroupEntity";
import {
  DEVICE_USER_ENTITY_TYPE,
  DEVICE_USER_ENTITY_CLASS,
} from "./jupiterone/entities/UserEntity";

const account: AirWatchAccount = {
  uuid: "account-1",
  name: "account-name",
};

const admins: AirWatchAdmin[] = [
  {
    uuid: "admin-1",
    organizationGroupUuid: "organization-group-1",
    username: "admin-1-username",
    firstName: "admin-1-firstName",
    lastName: "admin-1-lastName",
    email: "admin-1-email",
    displayName: "admin-1-displayName",
  },
];

const organizationGroups: AirWatchOrganizationGroup[] = [
  {
    Id: 123,
    Uuid: "organization-group-1",
    Name: "organization-group-name",
    GroupId: "group-id",
    LocationGroupType: "location-group-type",
    Country: "country",
    WebLink: "webLink",
    CreatedOn: "3/19/2020 12:19:56 AM",
  },
];

const devices: AirWatchDevice[] = [
  {
    Id: {
      Value: 123,
    },
    Uuid: "device-1",
    SerialNumber: "serialNumber-1",
    MacAddress: "macAddress-1",
    Imei: "imei-1",
    DeviceFriendlyName: "deviceFriendlyName-1",
    OwnerId: "device-1-ownerId",
    UserId: {
      Uuid: "device-1-ownerId",
      Name: "userid-name",
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

const deviceUsers: AirWatchDeviceUser[] = [
  {
    Id: {
      Value: 123,
    },
    Uuid: "device-1-ownerId",
    Name: "device-user-1-name",
  },
];

test("createAdminEntities", () => {
  expect(createAdminEntities("host", admins)).toEqual([
    {
      _class: ADMIN_ENTITY_CLASS,
      _key: "airwatch-admin-admin-1",
      _type: ADMIN_ENTITY_TYPE,
      _scope: "airwatch_user",
      _rawData: [
        {
          name: "default",
          rawData: {
            displayName: "admin-1-displayName",
            email: "admin-1-email",
            firstName: "admin-1-firstName",
            lastName: "admin-1-lastName",
            organizationGroupUuid: "organization-group-1",
            username: "admin-1-username",
            uuid: "admin-1",
          },
        },
      ],
      admin: true,
      displayName: "admin-1-firstName admin-1-lastName",
      email: "admin-1-email",
      firstName: "admin-1-firstName",
      lastName: "admin-1-lastName",
      organizationGroupUuid: "organization-group-1",
      username: "admin-1-username",
      uuid: "admin-1",
      webLink: "https://host/AirWatch/#/Admin/List",
    },
  ]);
});

test("createAccountEntity", () => {
  expect(createAccountEntity("host", account)).toEqual({
    _class: ACCOUNT_ENTITY_CLASS,
    _key: "airwatch-account-account-1",
    _type: ACCOUNT_ENTITY_TYPE,
    name: "account-name",
    uuid: "account-1",
    webLink: "https://host",
  });
});

test("createDeviceEntities", () => {
  expect(createDeviceEntities("host", devices)).toEqual([
    {
      _class: DEVICE_ENTITY_CLASS,
      _key: "airwatch-device-id-device-1",
      _type: DEVICE_ENTITY_TYPE,
      _rawData: [
        {
          name: "default",
          rawData: {
            Id: {
              Value: 123,
            },
            UserId: {
              Name: "userid-name",
              Uuid: "device-1-ownerId",
            },
            WifiSsid: "wifi-ssid",
            AssetNumber: "asset-number",
            DeviceFriendlyName: "deviceFriendlyName-1",
            Imei: "imei-1",
            IsSupervised: false,
            MacAddress: "macAddress-1",
            Model: "model",
            OperatingSystem: "os",
            OwnerId: "device-1-ownerId",
            Platform: "platform",
            SerialNumber: "serialNumber-1",
            Username: "username",
            Uuid: "device-1",
          },
        },
      ],
      uuid: "device-1",
      serialNumber: "serialNumber-1",
      macAddress: "macAddress-1",
      imei: "imei-1",
      ownerId: "device-1-ownerId",
      name: "deviceFriendlyName-1",
      assetNumber: "asset-number",
      platform: "platform",
      model: "model",
      operatingSystem: "os",
      webLink: "https://host/AirWatch/#/AirWatch/Device/Details/Summary/123",
      wifiSsid: "wifi-ssid",
      isSupervised: false,
      username: "username",
    },
  ]);
});

test("createOrganizationGroupEntities", () => {
  expect(
    createOrganizationGroupEntities("as1300.awmdm.com", organizationGroups),
  ).toEqual([
    {
      _class: ORGANIZATION_GROUP_ENTITY_CLASS,
      _key: "airwatch-user-group-id-organization-group-1",
      _type: ORGANIZATION_GROUP_ENTITY_TYPE,
      _rawData: [
        {
          name: "default",
          rawData: {
            Country: "country",
            CreatedOn: "3/19/2020 12:19:56 AM",
            GroupId: "group-id",
            Id: 123,
            LocationGroupType: "location-group-type",
            Name: "organization-group-name",
            Uuid: "organization-group-1",
            WebLink: "webLink",
          },
        },
      ],
      country: "country",
      createdOn: "1584616796000",
      displayName: "organization-group-name",
      groupId: 123,
      locationGroupType: "location-group-type",
      name: "organization-group-name",
      uuid: "organization-group-1",
      webLink:
        "https://as1300.awmdm.com/AirWatch/#/AirWatch/OrganizationGroup/Details/Index/123",
    },
  ]);
});

test("createUserEntities", () => {
  expect(createUserEntities("host", deviceUsers)).toEqual([
    {
      _class: DEVICE_USER_ENTITY_CLASS,
      _key: "airwatch-user-device-1-ownerId",
      _type: DEVICE_USER_ENTITY_TYPE,
      _rawData: [
        {
          name: "default",
          rawData: {
            Id: {
              Value: 123,
            },
            Name: "device-user-1-name",
            Uuid: "device-1-ownerId",
          },
        },
      ],
      name: "device-user-1-name",
      uuid: "device-1-ownerId",
      webLink: "https://host/AirWatch/#/AirWatch/User/Details/Summary/123",
    },
  ]);
});

// Testing Account->HAS->UserGroups
test("createAccountHasOrganizationGroupsRelationships", () => {
  const accountEntity = createAccountEntity("host", account);
  const organizationGroupEntities = createOrganizationGroupEntities(
    "as1300.awmdm.com",
    organizationGroups,
  );

  expect(
    createAccountRelationships(
      accountEntity,
      organizationGroupEntities,
      ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
      ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
      "has",
    ),
  ).toEqual([
    {
      _class: "HAS",
      _fromEntityKey: "airwatch-account-account-1",
      _key:
        "airwatch-account-account-1_has_airwatch-user-group-id-organization-group-1",
      _toEntityKey: "airwatch-user-group-id-organization-group-1",
      _type: ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
    },
  ]);
});

// Testing Account->MANAGES->Devices
test("createAccountManagesDevicesRelationships", () => {
  const accountEntity = createAccountEntity("host", account);
  const deviceEntities = createDeviceEntities("host", devices);

  expect(
    createAccountRelationships(
      accountEntity,
      deviceEntities,
      ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
      ACCOUNT_DEVICE_RELATIONSHIP_TYPE,
      "manages",
    ),
  ).toEqual([
    {
      _class: "MANAGES",
      _fromEntityKey: "airwatch-account-account-1",
      _key: "airwatch-account-account-1_manages_airwatch-device-id-device-1",
      _toEntityKey: "airwatch-device-id-device-1",
      _type: ACCOUNT_DEVICE_RELATIONSHIP_TYPE,
    },
  ]);
});

// Testing UserGroup->HAS->Admins(Users, airwatch_user)
test("createOrganizationGroupHasAdminsRelationships", () => {
  const organizationGroupEntities = createOrganizationGroupEntities(
    "as1300.awmdm.com",
    organizationGroups,
  );
  const adminEntities = createAdminEntities("host", admins);

  expect(
    createOrganizationGroupRelationships(
      organizationGroupEntities,
      adminEntities,
      ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE,
    ),
  ).toEqual([
    {
      _class: "HAS",
      _fromEntityKey: "airwatch-user-group-id-organization-group-1",
      _key:
        "airwatch-user-group-id-organization-group-1_has_airwatch-admin-admin-1",
      _toEntityKey: "airwatch-admin-admin-1",
      _type: ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE,
    },
  ]);
});

// Testing Device->HAS->Admins(Users, endpoint_user)
test("createDeviceHasUsersRelationships", () => {
  const userEntities = createUserEntities("host", deviceUsers);
  const deviceEntities = createDeviceEntities("host", devices);

  expect(
    createDeviceUserRelationships(
      userEntities,
      deviceEntities,
      USER_DEVICE_RELATIONSHIP_TYPE,
    ),
  ).toEqual([
    {
      _class: "HAS",
      _fromEntityKey: "airwatch-device-id-device-1",
      _key: "airwatch-device-id-device-1_has_airwatch-user-device-1-ownerId",
      _toEntityKey: "airwatch-user-device-1-ownerId",
      _type: USER_DEVICE_RELATIONSHIP_TYPE,
    },
  ]);
});

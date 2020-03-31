import {
  AirWatchAccount,
  AirWatchAdmin,
  AirWatchDevice,
  AirWatchDeviceUser,
  AirWatchOrganizationGroup,
} from "./airwatch/types";
import {
  ACCOUNT_ENTITY_CLASS,
  ACCOUNT_ENTITY_TYPE,
  ADMIN_ENTITY_CLASS,
  ADMIN_ENTITY_TYPE,
  createAccountEntity,
  createAdminEntity,
  createDeviceEntity,
  createOrganizationGroupEntity,
  createUserEntity,
  DEVICE_ENTITY_CLASS,
  DEVICE_ENTITY_TYPE,
  DEVICE_USER_ENTITY_CLASS,
  DEVICE_USER_ENTITY_TYPE,
  ORGANIZATION_GROUP_ENTITY_CLASS,
  ORGANIZATION_GROUP_ENTITY_TYPE,
} from "./jupiterone";

const account: AirWatchAccount = {
  uuid: "account.uuid",
  name: "account.name",
};

const admin: AirWatchAdmin = {
  uuid: "admin.uuid",
  organizationGroupUuid: "group.Uuid",
  username: "admin.username",
  firstName: "admin.firstName",
  lastName: "admin.lastName",
  email: "admin@myairwatch.test",
};

const organizationGroup: AirWatchOrganizationGroup = {
  Id: 123,
  Uuid: "group.Uuid",
  Name: "group.Name",
  GroupId: "group.GroupId",
  LocationGroupType: "group.LocationGroupType",
  Country: "group.Country",
  WebLink: "group.WebLink",
  CreatedOn: "3/19/2020 12:19:56 AM",
};

const device: AirWatchDevice = {
  Id: {
    Value: 123,
  },
  Uuid: "device.Uuid",
  SerialNumber: "device.SerialNumber",
  MacAddress: "dvice.MacAddress",
  Imei: "device.Imei",
  DeviceFriendlyName: "device.DeviceFriendlyName",
  OwnerId: "device.UserId.Uuid",
  UserId: {
    Uuid: "device.UserId.Uuid",
    Name: "device.UserId.Name",
  },
  AssetNumber: "device.AssetNumber",
  Platform: "device.Platform",
  Model: "device.Model",
  OperatingSystem: "device.OperatingSystem",
  WifiSsid: "device.WifiSsid",
  IsSupervised: false,
  Username: "device.Username",
};

const deviceUser: AirWatchDeviceUser = {
  Id: {
    Value: 123,
  },
  Uuid: "device.UserId.Uuid",
  Name: "device.UserId.Name",
};

describe("createAdminEntity", () => {
  test("all data", () => {
    expect(createAdminEntity("host", admin)).toMatchObject({
      _class: [ADMIN_ENTITY_CLASS],
      _key: "admin.uuid",
      _type: ADMIN_ENTITY_TYPE,
      _rawData: [
        {
          name: "default",
          rawData: admin,
        },
      ],
      admin: true,
      displayName: "admin.firstName admin.lastName",
      email: "admin@myairwatch.test",
      firstName: "admin.firstName",
      lastName: "admin.lastName",
      organizationGroupUuid: "group.Uuid",
      username: "admin.username",
      uuid: "admin.uuid",
      webLink: "https://host/AirWatch/#/Admin/List",
    });
  });
  test("missing name", () => {
    const adminNoName = {
      ...admin,
      firstName: "",
      lastName: "",
    };

    expect(createAdminEntity("host", adminNoName)).toMatchObject({
      _key: "admin.uuid",
      _type: ADMIN_ENTITY_TYPE,
      _class: [ADMIN_ENTITY_CLASS],
      _rawData: [{ name: "default", rawData: adminNoName }],
      uuid: "admin.uuid",
      organizationGroupUuid: "group.Uuid",
      username: "admin.username",
      firstName: "",
      lastName: "",
      displayName: "admin.username",
      email: "admin@myairwatch.test",
      webLink: "https://host/AirWatch/#/Admin/List",
      admin: true,
    });
  });
});

test("createAccountEntity", () => {
  expect(createAccountEntity("host", account)).toMatchObject({
    _class: [ACCOUNT_ENTITY_CLASS],
    _key: "account.uuid",
    _type: ACCOUNT_ENTITY_TYPE,
    _rawData: [{ name: "default", rawData: account }],
    name: "account.name",
    uuid: "account.uuid",
    webLink: "https://host",
  });
});

test("createDeviceEntity", () => {
  expect(createDeviceEntity("host", device)).toMatchObject({
    _class: DEVICE_ENTITY_CLASS,
    _key: "device.Uuid",
    _type: DEVICE_ENTITY_TYPE,
    _rawData: [
      {
        name: "default",
        rawData: device,
      },
    ],
    uuid: "device.Uuid",
    serialNumber: "device.SerialNumber",
    macAddress: "dvice.MacAddress",
    imei: "device.Imei",
    ownerId: "device.UserId.Uuid",
    name: "device.DeviceFriendlyName",
    assetNumber: "device.AssetNumber",
    platform: "device.Platform",
    model: "device.Model",
    operatingSystem: "device.OperatingSystem",
    webLink: "https://host/AirWatch/#/AirWatch/Device/Details/Summary/123",
    wifiSsid: "device.WifiSsid",
    isSupervised: false,
    username: "device.Username",
  });
});

test("createOrganizationGroupEntity", () => {
  expect(
    createOrganizationGroupEntity("as1300.awmdm.com", organizationGroup),
  ).toMatchObject({
    _class: ORGANIZATION_GROUP_ENTITY_CLASS,
    _key: "group.Uuid",
    _type: ORGANIZATION_GROUP_ENTITY_TYPE,
    _rawData: [
      {
        name: "default",
        rawData: organizationGroup,
      },
    ],
    country: "group.Country",
    createdOn: 1584620396,
    displayName: "group.Name",
    groupId: "group.GroupId",
    locationGroupType: "group.LocationGroupType",
    name: "group.Name",
    uuid: "group.Uuid",
    webLink:
      "https://as1300.awmdm.com/AirWatch/#/AirWatch/OrganizationGroup/Details/Index/123",
  });
});

test("createUserEntity", () => {
  expect(createUserEntity("host", deviceUser)).toMatchObject({
    _class: [DEVICE_USER_ENTITY_CLASS],
    _key: "device.UserId.Uuid",
    _type: DEVICE_USER_ENTITY_TYPE,
    _rawData: [
      {
        name: "default",
        rawData: deviceUser,
      },
    ],
    name: "device.UserId.Name",
    uuid: "device.UserId.Uuid",
    webLink: "https://host/AirWatch/#/AirWatch/User/Details/Summary/123",
  });
});

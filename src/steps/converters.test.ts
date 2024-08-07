import {
  AirWatchAdmin,
  AirWatchDevice,
  AirWatchDeviceUser,
  AirWatchOrganizationGroup,
} from '../client/types';
import {
  AdminEntityMetadata,
  DeviceUserEntityMetadata,
  OrganizationGroupEntityMetadata,
  UserEndpointEntityMetadata,
} from '../entities';
import {
  createAdminEntity,
  createDeviceEntity,
  createOrganizationGroupEntity,
  createUserEntity,
} from './converters';

const admin: AirWatchAdmin = {
  uuid: 'admin.uuid',
  organizationGroupUuid: 'group.Uuid',
  username: 'admin.username',
  firstName: 'admin.firstName',
  lastName: 'admin.lastName',
  email: 'admin@myairwatch.test',
  LocationGroup: '',
  LocationGroupId: '',
  LastLoginTimeStamp: '',
  timeZone: '',
  locale: '',
  messageTemplateId: '',
  messageTemplateUuid: '',
  initialLandingPage: '',
};

const organizationGroup: AirWatchOrganizationGroup = {
  Id: 123,
  Uuid: 'group.Uuid',
  Name: 'group.Name',
  GroupId: 'group.GroupId',
  LocationGroupType: 'group.LocationGroupType',
  Country: 'group.Country',
  WebLink: 'group.WebLink',
  CreatedOn: '3/19/2020 12:19:56 AM',
  Locale: 'en-US',
  Users: 0,
  Admins: 0,
  Devices: 0,
};

const device: AirWatchDevice = {
  Id: {
    Value: 123,
  },
  Uuid: 'device.Uuid',
  SerialNumber: 'device.SerialNumber',
  MacAddress: 'A6BBF6BEFBAB',
  LastSeen: '2020-03-20T19:25:19.843',
  Imei: 'device.Imei',
  DeviceFriendlyName: 'device.DeviceFriendlyName',
  OwnerId: 'device.UserId.Uuid',
  UserId: {
    Uuid: 'device.UserId.Uuid',
    Name: 'device.UserId.Name',
  },
  AssetNumber: 'device.AssetNumber',
  Platform: 'Android',
  Model: 'device.Model',
  OperatingSystem: 'device.OperatingSystem',
  WifiSsid: 'device.WifiSsid',
  IsSupervised: false,
  UserEmailAddress: 'john@testemail.com',
  UserName: 'device.Username',
  HostName: 'device.HostName',
  ComplianceStatus: 'Compliant',
};

const deviceUser: AirWatchDeviceUser = {
  Id: {
    Value: 123,
  },
  Uuid: 'device.UserId.Uuid',
  Name: 'device.UserId.Name',
};

describe('createAdminEntity', () => {
  test('all data', () => {
    expect(createAdminEntity('host', admin)).toMatchObject({
      _class: AdminEntityMetadata._class,
      _key: 'admin.uuid',
      _type: AdminEntityMetadata._type,
      _rawData: [
        {
          name: 'default',
          rawData: admin,
        },
      ],
      admin: true,
      name: 'admin.firstName admin.lastName',
      displayName: 'admin.firstName admin.lastName',
      email: 'admin@myairwatch.test',
      firstName: 'admin.firstName',
      lastName: 'admin.lastName',
      organizationGroupUuid: 'group.Uuid',
      username: 'admin.username',
      uuid: 'admin.uuid',
      webLink: 'https://host/AirWatch/#/Admin/List',
    });
  });

  test('missing name', () => {
    const adminNoName = {
      ...admin,
      firstName: '',
      lastName: '',
    };

    expect(createAdminEntity('host', adminNoName)).toMatchObject({
      _key: 'admin.uuid',
      _type: AdminEntityMetadata._type,
      _class: AdminEntityMetadata._class,
      _rawData: [{ name: 'default', rawData: adminNoName }],
      uuid: 'admin.uuid',
      organizationGroupUuid: 'group.Uuid',
      username: 'admin.username',
      firstName: '',
      lastName: '',
      displayName: 'admin.username',
      email: 'admin@myairwatch.test',
      webLink: 'https://host/AirWatch/#/Admin/List',
      admin: true,
    });
  });
});

test('createDeviceEntity', () => {
  expect(createDeviceEntity('host', device)).toMatchObject({
    _class: UserEndpointEntityMetadata._class,
    _key: 'device.Uuid',
    _type: UserEndpointEntityMetadata._type,
    _rawData: [
      {
        name: 'default',
        rawData: device,
      },
    ],
    uuid: 'device.Uuid',
    serial: 'device.SerialNumber',
    macAddress: 'a6:bb:f6:be:fb:ab',
    imei: 'device.Imei',
    ownerId: 'device.UserId.Uuid',
    name: 'device.DeviceFriendlyName',
    assetNumber: 'device.AssetNumber',
    platform: 'android',
    model: 'device.Model',
    make: 'device.Model',
    operatingSystem: 'device.OperatingSystem',
    webLink: 'https://host/AirWatch/#/AirWatch/Device/Details/Summary/123',
    wifiSsid: 'device.WifiSsid',
    isSupervised: false,
    username: 'device.Username',
    hostname: 'device.HostName',
    complianceStatus: 1,
    category: 'endpoint',
    lastSeenOn: 1584732319843,
  });
});

test('createOrganizationGroupEntity', () => {
  expect(
    createOrganizationGroupEntity('as1300.awmdm.com', organizationGroup),
  ).toMatchObject({
    _class: OrganizationGroupEntityMetadata._class,
    _key: 'group.Uuid',
    _type: OrganizationGroupEntityMetadata._type,
    _rawData: [
      {
        name: 'default',
        rawData: organizationGroup,
      },
    ],
    id: '123',
    country: 'group.Country',
    createdOn: 1584620396,
    displayName: 'group.Name',
    groupId: 'group.GroupId',
    locationGroupType: 'group.LocationGroupType',
    name: 'group.Name',
    uuid: 'group.Uuid',
    webLink:
      'https://as1300.awmdm.com/AirWatch/#/AirWatch/OrganizationGroup/Details/Index/123',
  });
});

test('createUserEntity', () => {
  expect(createUserEntity('host', deviceUser)).toMatchObject({
    _class: DeviceUserEntityMetadata._class,
    _key: 'device.UserId.Uuid',
    _type: DeviceUserEntityMetadata._type,
    _rawData: [
      {
        name: 'default',
        rawData: deviceUser,
      },
    ],
    name: 'device.UserId.Name',
    username: 'device.UserId.Name',
    uuid: 'device.UserId.Uuid',
    webLink: 'https://host/AirWatch/#/AirWatch/User/Details/Summary/123',
  });
});

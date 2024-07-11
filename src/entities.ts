import { SchemaType } from '@jupiterone/integration-sdk-core';
import {
  createEntityType,
  createEntityMetadata,
  createMultiClassEntityMetadata,
} from './helpers';
import { typeboxClassSchemaMap } from '@jupiterone/data-model';

type PlatformValues =
  | 'other'
  | 'darwin'
  | 'linux'
  | 'unix'
  | 'windows'
  | 'android'
  | 'ios'
  | 'embedded';

// https://resources.workspaceone.com/view/zv5cgwjrcv972rd6fmml/en --> chapter 17 for platform values
// Will not use until cutover strategy is defined
export const platformConverter = (apiPlatformValue: string): PlatformValues => {
  const lowerCasePlatform = apiPlatformValue.toLowerCase();
  if (lowerCasePlatform.includes('android')) {
    return 'android';
  } else if (lowerCasePlatform === 'apple') {
    return 'ios';
  } else if (lowerCasePlatform.includes('windows')) {
    return 'windows';
  } else {
    return 'other';
  }
};

export const [AccountEntityMetadata, createAccountAssignEntity] =
  createEntityMetadata({
    resourceName: 'Account',
    _class: ['Account'],
    _type: createEntityType('account'),
    description: 'Airwatch Account',
    schema: SchemaType.Object({
      name: SchemaType.String(),
    }),
  });

export const [AdminEntityMetadata, createAdminAssignEntity] =
  createEntityMetadata({
    resourceName: 'Admin',
    _class: ['User'],
    _type: createEntityType('user'),
    description: 'Airwatch Admin',
    schema: SchemaType.Object({
      admin: SchemaType.Boolean(),
      uuid: SchemaType.Optional(SchemaType.String()),
      organizationGroupUuid: SchemaType.Optional(SchemaType.String()),
      username: SchemaType.Optional(SchemaType.String()),
      firstName: SchemaType.Optional(SchemaType.String()),
      lastName: SchemaType.Optional(SchemaType.String()),
      email: SchemaType.Optional(SchemaType.String()),
    }),
  });

export const [
  OrganizationGroupEntityMetadata,
  createOrganizationGroupAssignEntity,
] = createMultiClassEntityMetadata({
  resourceName: 'Organization Group',
  _class: [typeboxClassSchemaMap['Group'], typeboxClassSchemaMap['UserGroup']],
  _type: createEntityType('group'),
  description: 'Airwatch Group',
  schema: SchemaType.Object({
    uuid: SchemaType.Optional(SchemaType.String()),
    groupId: SchemaType.Optional(SchemaType.String()),
    locationGroupType: SchemaType.Optional(SchemaType.String()),
    country: SchemaType.Optional(SchemaType.String()),
  }),
});

export const [UserEndpointEntityMetadata, createUserEndpointAssignEntity] =
  createMultiClassEntityMetadata({
    resourceName: 'Device',
    _class: [typeboxClassSchemaMap['Host'], typeboxClassSchemaMap['Device']],
    _type: 'user_endpoint',
    description: 'Airwatch User Endpoint',
    schema: SchemaType.Object({
      username: SchemaType.Optional(SchemaType.String()),
      email: SchemaType.Optional(SchemaType.String()),
      uuid: SchemaType.Optional(SchemaType.String()),
      serialNumber: SchemaType.Optional(SchemaType.String()),
      imei: SchemaType.Optional(SchemaType.String()),
      deviceFriendlyName: SchemaType.Optional(SchemaType.String()),
      ownerId: SchemaType.Optional(SchemaType.String()),
      assetNumber: SchemaType.Optional(SchemaType.String()),
      hostName: SchemaType.Optional(SchemaType.String()),
      wifiSsid: SchemaType.Optional(SchemaType.String()),
      isSupervised: SchemaType.Optional(SchemaType.Boolean()),
      userEmailAddress: SchemaType.Optional(SchemaType.String()),
      airwatchPlatform: SchemaType.Optional(SchemaType.String()),
    }),
  });

export const [DeviceUserEntityMetadata, createDeviceUserAssignEntity] =
  createEntityMetadata({
    resourceName: 'Device User',
    _class: ['User'],
    _type: 'device_user',
    description: 'Airwatch Device User',
    schema: SchemaType.Object({
      uuid: SchemaType.Optional(SchemaType.String()),
    }),
  });

export const [ProfileEntityMetadata, createProfileAssignEntity] =
  createEntityMetadata({
    resourceName: 'Profile',
    _class: ['Configuration'],
    _type: createEntityType('profile'),
    description: 'Airwatch Profile',
    schema: SchemaType.Object({
      platform: SchemaType.Optional(SchemaType.String()),
      managedBy: SchemaType.Optional(SchemaType.String()),
      payloads: SchemaType.Optional(SchemaType.Array(SchemaType.String())),
    }),
  });

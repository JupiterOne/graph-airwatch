import {
  generateRelationshipType,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import {
  AccountEntityMetadata,
  AdminEntityMetadata,
  DeviceUserEntityMetadata,
  OrganizationGroupEntityMetadata,
  ProfileEntityMetadata,
  UserEndpointEntityMetadata,
} from '../entities';

export const STEP_FETCH_ACCOUNT = 'fetch-account';
export const STEP_FETCH_ORGANIZATION_GROUPS = 'fetch-org-groups';
export const STEP_FETCH_ADMINS = 'fetch-admins';
export const STEP_FETCH_DEVICES = 'fetch-devices';
export const STEP_FETCH_PROFILES = 'fetch-profiles';
export const STEP_BUILD_PROFILE_TO_DEVICE = 'build-profile-device-relationship';

export const ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS =
  RelationshipClass.HAS;
export const ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE =
  generateRelationshipType(
    ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
    AccountEntityMetadata._type,
    OrganizationGroupEntityMetadata._type,
  );

export const ACCOUNT_DEVICE_RELATIONSHIP_CLASS = RelationshipClass.MANAGES;
export const ACCOUNT_DEVICE_RELATIONSHIP_TYPE = generateRelationshipType(
  ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
  AccountEntityMetadata._type,
  UserEndpointEntityMetadata._type,
);

export const ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_CLASS =
  RelationshipClass.HAS;
export const ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE =
  generateRelationshipType(
    ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_CLASS,
    OrganizationGroupEntityMetadata._type,
    AdminEntityMetadata._type,
  );

export const ORGANIZATION_GROUP_RELATIONSHIP_CLASS = RelationshipClass.HAS;
export const ORGANIZATION_GROUP_RELATIONSHIP_TYPE = generateRelationshipType(
  ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
  OrganizationGroupEntityMetadata._type,
  OrganizationGroupEntityMetadata._type,
);

export const USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_CLASS =
  RelationshipClass.HAS;
export const USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_TYPE =
  generateRelationshipType(
    USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_CLASS,
    UserEndpointEntityMetadata._type,
    DeviceUserEntityMetadata._type,
  );

export const DEVICE_PROFILE_REATIONSHIP_CLASS = RelationshipClass.INSTALLED;
export const DEVICE_PROFILE_REATIONSHIP_TYPE = generateRelationshipType(
  DEVICE_PROFILE_REATIONSHIP_CLASS,
  UserEndpointEntityMetadata._type,
  ProfileEntityMetadata._type,
);
export const Entities = {
  ACCOUNT: AccountEntityMetadata,
  ADMIN: AdminEntityMetadata,
  ORGANIZATION_GROUP: OrganizationGroupEntityMetadata,
  USER_ENDPOINT: UserEndpointEntityMetadata,
  DEVICE_USER: DeviceUserEntityMetadata,
  PROFILE: ProfileEntityMetadata,
};

export const Relationships = {
  ACCOUNT_ORGANIZATION_GROUP: {
    _type: ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
    _class: ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
    sourceType: AccountEntityMetadata._type,
    targetType: OrganizationGroupEntityMetadata._type,
  },
  ACCOUNT_DEVICE: {
    _type: ACCOUNT_DEVICE_RELATIONSHIP_TYPE,
    _class: ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
    sourceType: AccountEntityMetadata._type,
    targetType: UserEndpointEntityMetadata._type,
  },
  ORGANIZATION_GROUP_ADMIN: {
    _type: ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE,
    _class: ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_CLASS,
    sourceType: OrganizationGroupEntityMetadata._type,
    targetType: AdminEntityMetadata._type,
  },
  ORGANIZATION_GROUP_GROUP: {
    _type: ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
    _class: ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
    sourceType: OrganizationGroupEntityMetadata._type,
    targetType: OrganizationGroupEntityMetadata._type,
  },
  USER_ENDPOINT_DEVICE_USER: {
    _type: USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_TYPE,
    _class: USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_CLASS,
    sourceType: UserEndpointEntityMetadata._type,
    targetType: DeviceUserEntityMetadata._type,
  },
  DEVICE_PROFILE: {
    _type: DEVICE_PROFILE_REATIONSHIP_TYPE,
    _class: DEVICE_PROFILE_REATIONSHIP_CLASS,
    sourceType: UserEndpointEntityMetadata._type,
    targetType: ProfileEntityMetadata._type,
  },
};

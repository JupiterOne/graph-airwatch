import {
  generateRelationshipType,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

export const STEP_FETCH_ACCOUNT = 'fetch-account';
export const STEP_FETCH_ORGANIZATION_GROUPS = 'fetch-org-groups';
export const STEP_FETCH_ADMINS = 'fetch-admins';
export const STEP_FETCH_DEVICES = 'fetch-devices';
export const STEP_FETCH_PROFILES = 'fetch-profiles';
export const STEP_BUILD_PROFILE_TO_DEVICE = 'build-profile-device-relationship';

export const ACCOUNT_ENTITY_TYPE = 'airwatch_account';
export const ACCOUNT_ENTITY_CLASS = 'Account';

export const ADMIN_ENTITY_TYPE = 'airwatch_user';
export const ADMIN_ENTITY_CLASS = 'User';

export const DEVICE_ENTITY_TYPE = 'user_endpoint';
export const DEVICE_ENTITY_CLASS = ['Host', 'Device'];

export const DEVICE_USER_ENTITY_TYPE = 'device_user';
export const DEVICE_USER_ENTITY_CLASS = 'User';

export const ORGANIZATION_GROUP_ENTITY_TYPE = 'airwatch_group';
export const ORGANIZATION_GROUP_ENTITY_CLASS = ['Group', 'UserGroup'];

export const PROFILE_ENTITY_TYPE = 'airwatch_profile';
export const PROFILE_ENTITY_CLASS = ['Configuration'];

export const ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS =
  RelationshipClass.HAS;
export const ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE =
  generateRelationshipType(
    ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
    ACCOUNT_ENTITY_TYPE,
    ORGANIZATION_GROUP_ENTITY_TYPE,
  );

export const ACCOUNT_DEVICE_RELATIONSHIP_CLASS = RelationshipClass.MANAGES;
export const ACCOUNT_DEVICE_RELATIONSHIP_TYPE = generateRelationshipType(
  ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
  ACCOUNT_ENTITY_TYPE,
  DEVICE_ENTITY_TYPE,
);

export const ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_CLASS =
  RelationshipClass.HAS;
export const ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE =
  generateRelationshipType(
    ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_CLASS,
    ORGANIZATION_GROUP_ENTITY_TYPE,
    ADMIN_ENTITY_TYPE,
  );

export const ORGANIZATION_GROUP_RELATIONSHIP_CLASS = RelationshipClass.HAS;
export const ORGANIZATION_GROUP_RELATIONSHIP_TYPE = generateRelationshipType(
  ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
  ORGANIZATION_GROUP_ENTITY_TYPE,
  ORGANIZATION_GROUP_ENTITY_TYPE,
);

export const USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_CLASS =
  RelationshipClass.HAS;
export const USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_TYPE =
  generateRelationshipType(
    USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_CLASS,
    DEVICE_ENTITY_TYPE,
    DEVICE_USER_ENTITY_TYPE,
  );

export const DEVICE_PROFILE_REATIONSHIP_CLASS = RelationshipClass.INSTALLED;
export const DEVICE_PROFILE_REATIONSHIP_TYPE = generateRelationshipType(
  DEVICE_PROFILE_REATIONSHIP_CLASS,
  DEVICE_ENTITY_TYPE,
  PROFILE_ENTITY_TYPE,
);
export const Entities = {
  ACCOUNT: {
    _type: ACCOUNT_ENTITY_TYPE,
    _class: ACCOUNT_ENTITY_CLASS,
    resourceName: 'Account',
  },
  ADMIN: {
    _type: ADMIN_ENTITY_TYPE,
    _class: ADMIN_ENTITY_CLASS,
    resourceName: 'Admin',
  },
  ORGANIZATION_GROUP: {
    _type: ORGANIZATION_GROUP_ENTITY_TYPE,
    _class: ORGANIZATION_GROUP_ENTITY_CLASS,
    resourceName: 'Organization Group',
  },
  USER_ENDPOINT: {
    _type: DEVICE_ENTITY_TYPE,
    _class: DEVICE_ENTITY_CLASS,
    resourceName: 'Device',
  },
  DEVICE_USER: {
    _type: DEVICE_USER_ENTITY_TYPE,
    _class: DEVICE_USER_ENTITY_CLASS,
    resourceName: 'Device User',
  },
  PROFILE: {
    _type: PROFILE_ENTITY_TYPE,
    _class_: PROFILE_ENTITY_CLASS,
    resourceName: 'Profile',
  },
};

export const Relationships = {
  ACCOUNT_ORGANIZATION_GROUP: {
    _type: ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
    _class: ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
    sourceType: ACCOUNT_ENTITY_TYPE,
    targetType: ORGANIZATION_GROUP_ENTITY_TYPE,
  },
  ACCOUNT_DEVICE: {
    _type: ACCOUNT_DEVICE_RELATIONSHIP_TYPE,
    _class: ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
    sourceType: ACCOUNT_ENTITY_TYPE,
    targetType: DEVICE_ENTITY_TYPE,
  },
  ORGANIZATION_GROUP_ADMIN: {
    _type: ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE,
    _class: ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_CLASS,
    sourceType: ORGANIZATION_GROUP_ENTITY_TYPE,
    targetType: ADMIN_ENTITY_TYPE,
  },
  ORGANIZATION_GROUP_GROUP: {
    _type: ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
    _class: ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
    sourceType: ORGANIZATION_GROUP_ENTITY_TYPE,
    targetType: ORGANIZATION_GROUP_ENTITY_TYPE,
  },
  USER_ENDPOINT_DEVICE_USER: {
    _type: USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_TYPE,
    _class: USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_CLASS,
    sourceType: DEVICE_ENTITY_TYPE,
    targetType: DEVICE_USER_ENTITY_TYPE,
  },
  DEVICE_PROFILE: {
    _type: DEVICE_PROFILE_REATIONSHIP_TYPE,
    _class: DEVICE_PROFILE_REATIONSHIP_CLASS,
    sourceType: DEVICE_ENTITY_TYPE,
    targetType: PROFILE_ENTITY_TYPE,
  },
};

import { DataModel, generateRelationshipType } from "@jupiterone/data-model";

// Entities

export const ACCOUNT_ENTITY_TYPE = "airwatch_account";
export const ACCOUNT_ENTITY_CLASS = "Account";

export const ADMIN_ENTITY_TYPE = "airwatch_user";
export const ADMIN_ENTITY_CLASS = "User";

export const DEVICE_ENTITY_TYPE = "user_endpoint";
export const DEVICE_ENTITY_CLASS = ["Host", "Device"];

export const DEVICE_USER_ENTITY_TYPE = "device_user";
export const DEVICE_USER_ENTITY_CLASS = "User";

export const ORGANIZATION_GROUP_ENTITY_TYPE = "airwatch_group";
export const ORGANIZATION_GROUP_ENTITY_CLASS = ["Group", "UserGroup"];

// Relationships

export const ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS =
  DataModel.RelationshipClass.HAS;
export const ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE = generateRelationshipType(
  ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
  ACCOUNT_ENTITY_TYPE,
  ORGANIZATION_GROUP_ENTITY_TYPE,
);

export const ACCOUNT_DEVICE_RELATIONSHIP_CLASS =
  DataModel.RelationshipClass.MANAGES;
export const ACCOUNT_DEVICE_RELATIONSHIP_TYPE = generateRelationshipType(
  ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
  ACCOUNT_ENTITY_TYPE,
  DEVICE_ENTITY_TYPE,
);

export const ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_CLASS =
  DataModel.RelationshipClass.HAS;
export const ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE = generateRelationshipType(
  ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_CLASS,
  ORGANIZATION_GROUP_ENTITY_TYPE,
  ADMIN_ENTITY_TYPE,
);

export const USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_CLASS =
  DataModel.RelationshipClass.HAS;
export const USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_TYPE = generateRelationshipType(
  USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_CLASS,
  DEVICE_ENTITY_TYPE,
  DEVICE_USER_ENTITY_TYPE,
);

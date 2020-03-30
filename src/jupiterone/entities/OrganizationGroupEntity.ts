import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const ORGANIZATION_GROUP_ENTITY_TYPE = "airwatch_user_group";
export const ORGANIZATION_GROUP_ENTITY_CLASS = "UserGroup";

export interface OrganizationGroupEntity extends EntityFromIntegration {
  uuid: string;
  name: string;
  locationGroupType: string;
  groupId: number;
  country: string;
  displayName: string;
  webLink: string;
  createdOn: string;
}

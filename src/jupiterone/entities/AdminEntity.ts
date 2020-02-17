import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const ADMIN_ENTITY_TYPE = "airwatch_user";
export const ADMIN_ENTITY_CLASS = "User";

export interface AdminEntity extends EntityFromIntegration {
  uuid: string;
  organizationGroupUuid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  webLink: string;
}

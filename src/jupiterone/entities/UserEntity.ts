import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const DEVICE_USER_ENTITY_TYPE = "endpoint_user";
export const DEVICE_USER_ENTITY_CLASS = "User";

export interface UserEntity extends EntityFromIntegration {
  uuid: string;
  name: string;
}

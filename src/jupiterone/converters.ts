import {
  convertProperties,
  createIntegrationEntity,
  EntityFromIntegration,
} from "@jupiterone/jupiter-managed-integration-sdk";

import {
  AirWatchAccount,
  AirWatchAdmin,
  AirWatchDevice,
  AirWatchDeviceUser,
  AirWatchOrganizationGroup,
} from "../airwatch/types";
import { parseDatetime } from "../utils";
import {
  ACCOUNT_ENTITY_CLASS,
  ACCOUNT_ENTITY_TYPE,
  ADMIN_ENTITY_CLASS,
  ADMIN_ENTITY_TYPE,
  DEVICE_ENTITY_CLASS,
  DEVICE_ENTITY_TYPE,
  DEVICE_USER_ENTITY_CLASS,
  DEVICE_USER_ENTITY_TYPE,
  ORGANIZATION_GROUP_ENTITY_CLASS,
  ORGANIZATION_GROUP_ENTITY_TYPE,
} from "./graph";

export function createAccountEntity(
  host: string,
  data: AirWatchAccount,
): EntityFromIntegration {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: ACCOUNT_ENTITY_CLASS,
        _type: ACCOUNT_ENTITY_TYPE,
        _key: data.uuid,
        webLink: `https://${host}`,
        ...convertProperties(data),
      },
    },
  });
}

export function createAdminEntity(
  host: string,
  data: AirWatchAdmin,
): EntityFromIntegration {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: ADMIN_ENTITY_CLASS,
        _type: ADMIN_ENTITY_TYPE,
        _key: data.uuid,
        ...convertProperties(data),
        displayName:
          data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : data.username,
        admin: true,
        webLink: `https://${host}/AirWatch/#/Admin/List`,
      },
    },
  });
}

export function createDeviceEntity(
  host: string,
  data: AirWatchDevice,
): EntityFromIntegration {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: DEVICE_ENTITY_CLASS,
        _type: DEVICE_ENTITY_TYPE,
        _key: data.Uuid,
        ...convertProperties(data),
        webLink: `https://${host}/AirWatch/#/AirWatch/Device/Details/Summary/${data.Id.Value}`,
        name: data.DeviceFriendlyName,
      },
    },
  });
}

export function createOrganizationGroupEntity(
  host: string,
  data: AirWatchOrganizationGroup,
): EntityFromIntegration {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: ORGANIZATION_GROUP_ENTITY_CLASS,
        _key: data.Uuid,
        _type: ORGANIZATION_GROUP_ENTITY_TYPE,
        ...convertProperties(data),
        webLink: `https://${host}/AirWatch/#/AirWatch/OrganizationGroup/Details/Index/${data.Id}`,
        createdOn: parseDatetime(data.CreatedOn),
      },
    },
  });
}

export function createUserEntity(
  host: string,
  data: AirWatchDeviceUser,
): EntityFromIntegration {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: DEVICE_USER_ENTITY_CLASS,
        _type: DEVICE_USER_ENTITY_TYPE,
        _key: data.Uuid,
        ...convertProperties(data),
        webLink: `https://${host}/AirWatch/#/AirWatch/User/Details/Summary/${data.Id.Value}`,
      },
    },
  });
}

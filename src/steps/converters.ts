import moment from 'moment';

import {
  convertProperties,
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import {
  AirWatchAdmin,
  AirWatchDevice,
  AirWatchDeviceUser,
  AirWatchOrganizationGroup,
} from '../client/types';
import {
  ADMIN_ENTITY_CLASS,
  ADMIN_ENTITY_TYPE,
  DEVICE_ENTITY_CLASS,
  DEVICE_ENTITY_TYPE,
  DEVICE_USER_ENTITY_CLASS,
  DEVICE_USER_ENTITY_TYPE,
  ORGANIZATION_GROUP_ENTITY_CLASS,
  ORGANIZATION_GROUP_ENTITY_TYPE,
} from './constants';

export function createAdminEntity(host: string, data: AirWatchAdmin): Entity {
  const name =
    data.firstName && data.lastName
      ? `${data.firstName} ${data.lastName}`
      : data.username;

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: ADMIN_ENTITY_CLASS,
        _type: ADMIN_ENTITY_TYPE,
        _key: data.uuid,
        ...convertProperties(data),
        name,
        admin: true,
        webLink: `https://${host}/AirWatch/#/Admin/List`,
      },
    },
  });
}

export function createDeviceEntity(host: string, data: AirWatchDevice): Entity {
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
        hostname: data.HostName,
        complianceStatus: data.ComplianceStatus === 'Compliant' ? 1 : undefined,
        platform: String(data.Platform).toLowerCase(),
      },
    },
  });
}

export function createOrganizationGroupEntity(
  host: string,
  data: AirWatchOrganizationGroup,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: ORGANIZATION_GROUP_ENTITY_CLASS,
        _key: data.Uuid,
        _type: ORGANIZATION_GROUP_ENTITY_TYPE,
        ...convertProperties(data),
        id: String(data.Id),
        webLink: `https://${host}/AirWatch/#/AirWatch/OrganizationGroup/Details/Index/${data.Id}`,
        createdOn: parseDatetime(data.CreatedOn),
      },
    },
  });
}

export function createUserEntity(
  host: string,
  data: AirWatchDeviceUser,
): Entity {
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

function parseDatetime(time: string): number {
  return moment.utc(time, 'M/D/YYYY h:m:ss').unix();
}

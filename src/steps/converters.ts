import { utc } from 'moment';

import {
  convertProperties,
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import {
  AirWatchAdmin,
  AirWatchDevice,
  AirWatchDeviceUser,
  AirWatchOrganizationGroup,
  AirwatchProfile,
} from '../client/types';
import {
  createAdminAssignEntity,
  createDeviceUserAssignEntity,
  createOrganizationGroupAssignEntity,
  createProfileAssignEntity,
  createUserEndpointAssignEntity,
} from '../entities';

export function createAdminEntity(host: string, data: AirWatchAdmin): Entity {
  const name =
    data.firstName && data.lastName
      ? `${data.firstName} ${data.lastName}`
      : data.username;

  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: createAdminAssignEntity({
        _key: data.uuid,
        name,
        admin: true,
        webLink: `https://${host}/AirWatch/#/Admin/List`,
        uuid: data.uuid,
        organizationGroupUuid: data.organizationGroupUuid,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        initialLandingPage: data.initialLandingPage,
        lastLoginTimeStamp: parseTimePropertyValue(data.LastLoginTimeStamp),
        locale: data.locale,
        locationGroup: data.LocationGroup,
        locationGroupId: data.LocationGroupId,
        messageTemplateId: data.messageTemplateId,
        messageTemplateUuid: data.messageTemplateUuid,
        timeZone: data.timeZone,
      }),
    },
  });
}

export function createDeviceEntity(
  host: string,
  data: AirWatchDevice,
  securityDetails?,
): Entity {
  const formatMacAddress = (macAddress: string | undefined) =>
    macAddress && macAddress.length == 12
      ? macAddress.replace(/(.{2})(?=.)/g, '$1:').toLowerCase()
      : undefined;
  const name =
    data.DeviceFriendlyName ||
    `${data.UserName || 'Unknown User'}'s ${data.Model || 'Device'}`;
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: createUserEndpointAssignEntity({
        _key: data.Uuid,
        // TODO: Explicitly pull out properties instead of using convertProperties.
        ...convertProperties(securityDetails ? securityDetails : {}),
        username: data.UserName,
        owner: data.UserId?.Name,
        email: data.UserEmailAddress?.toLowerCase(),
        webLink: `https://${host}/AirWatch/#/AirWatch/Device/Details/Summary/${data.Id.Value}`,
        name,
        displayName: name,
        hostname: data.HostName,
        complianceStatus: data.ComplianceStatus === 'Compliant' ? 1 : undefined,
        // todo: use platformConverter once rollout strategy is implemented
        platform: String(data.Platform).toLowerCase() as any,
        make: data.Model,
        model: data.Model,
        serial: data.SerialNumber,
        deviceId: data.Id.Value?.toString(),
        macAddress: formatMacAddress(data.MacAddress),
        category: 'endpoint',
        lastSeenOn:
          parseTimePropertyValue(
            !data.LastSeen || data.LastSeen?.endsWith('Z')
              ? data.LastSeen
              : data.LastSeen + 'Z',
          ) ?? null, // LastSeen is not correctly formatted as an ISO string in AirWatch so we have to do it manually.
        uuid: data.Uuid,
        serialNumber: data.SerialNumber,
        imei: data.Imei,
        deviceFriendlyName: data.DeviceFriendlyName,
        ownerId: data.OwnerId,
        assetNumber: data.AssetNumber,
        hostName: data.HostName,
        osName: data.OperatingSystem,
        wifiSsid: data.WifiSsid,
        isSupervised: data.IsSupervised,
        userEmailAddress: data.UserEmailAddress,
        operatingSystem: data.OperatingSystem,
      }),
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
      assign: createOrganizationGroupAssignEntity({
        _key: data.Uuid,
        displayName: data.Name,
        name: data.Name,
        id: String(data.Id),
        webLink: `https://${host}/AirWatch/#/AirWatch/OrganizationGroup/Details/Index/${data.Id}`,
        createdOn: parseDatetime(data.CreatedOn),
        uuid: data.Uuid,
        groupId: data.GroupId,
        locationGroupType: data.LocationGroupType,
        country: data.Country,
        admins: Number(data.Admins),
        devices: Number(data.Devices),
        users: Number(data.Users),
        locale: data.Locale,
      }),
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
      assign: createDeviceUserAssignEntity({
        _key: data.Uuid,
        name: data.Name,
        displayName: data.Name,
        uuid: data.Uuid,
        username: data.Name,
        webLink: `https://${host}/AirWatch/#/AirWatch/User/Details/Summary/${data.Id.Value}`,
      }),
    },
  });
}

export function createProfileEntity(
  host: string,
  data: AirwatchProfile,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: createProfileAssignEntity({
        _key: data.uuid,
        name: data.name,
        platform: data.platform,
        status: data.status,
        managedBy: data.managed_by,
        payloads: data.configured_payload.map((entry) => entry.name),
        webLink: `https://${host}/AirWatch/#/Profile/List/`,
      }),
    },
  });
}

function parseDatetime(time: string): number {
  return utc(time, 'M/D/YYYY h:m:ss').unix();
}

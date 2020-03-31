/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/require-await */

import {
  IntegrationExecutionContext,
  IntegrationExecutionResult,
} from "@jupiterone/jupiter-managed-integration-sdk";

import AirwatchClient from "./airwatch/AirwatchClient";
import { AirWatchAccount, AirWatchDevice } from "./airwatch/types";
import {
  createAccountEntity,
  createAccountRelationships,
  createAdminEntities,
  createDeviceEntities,
  createDeviceUserRelationships,
  createOrganizationGroupEntities,
  createOrganizationGroupRelationships,
  createUserEntities,
} from "./converters";
import initializeContext from "./initializeContext";
import {
  ACCOUNT_ENTITY_TYPE,
  AccountEntity,
} from "./jupiterone/entities/AccountEntity";
import {
  ADMIN_ENTITY_TYPE,
  AdminEntity,
} from "./jupiterone/entities/AdminEntity";
import {
  DEVICE_ENTITY_TYPE,
  DeviceEntity,
} from "./jupiterone/entities/DeviceEntity";
import {
  ORGANIZATION_GROUP_ENTITY_TYPE,
  OrganizationGroupEntity,
} from "./jupiterone/entities/OrganizationGroupEntity";
import {
  DEVICE_USER_ENTITY_TYPE,
  UserEntity,
} from "./jupiterone/entities/UserEntity";
import {
  ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
  ACCOUNT_DEVICE_RELATIONSHIP_TYPE,
} from "./jupiterone/relationships/AccountDeviceRelationship";
import {
  ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
  ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
} from "./jupiterone/relationships/AccountOrganizationGroupRelationship";
import { USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_TYPE } from "./jupiterone/relationships/DeviceUserRelationship";
import { ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE } from "./jupiterone/relationships/OrganizationGroupAdminRelationship";

export default async function executionHandler(
  context: IntegrationExecutionContext,
): Promise<IntegrationExecutionResult> {
  const { graph, persister, provider, account } = initializeContext(context);

  // Get all existing entities from graph
  const [
    oldAccountEntities,
    oldAdminEntities,
    oldOrganizationGroupEntities,
    oldDeviceEntities,
    oldUsers,
  ] = await Promise.all([
    graph.findEntitiesByType<AccountEntity>(ACCOUNT_ENTITY_TYPE),
    graph.findEntitiesByType<AdminEntity>(ADMIN_ENTITY_TYPE),
    graph.findEntitiesByType<OrganizationGroupEntity>(
      ORGANIZATION_GROUP_ENTITY_TYPE,
    ),
    graph.findEntitiesByType<DeviceEntity>(DEVICE_ENTITY_TYPE),
    graph.findEntitiesByType<UserEntity>(DEVICE_USER_ENTITY_TYPE),
  ]);

  // Get all existing relationships from graph
  const [
    oldAccountRelationships,
    oldOrganizationGroupRelationships,
    oldUserDeviceRelationships,
  ] = await Promise.all([
    graph.findRelationshipsByType([
      ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
      ACCOUNT_DEVICE_RELATIONSHIP_TYPE,
    ]),
    graph.findRelationshipsByType([ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE]),
    graph.findRelationshipsByType([
      USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_TYPE,
    ]),
  ]);

  // Get all new entities from API
  const newAccountEntities = await fetchAccountEntities(provider, account);
  const newAdminEntities = await fetchAdminEntitiesFromProvider(provider);
  const newOrganizationGroupEntities = await fetchOrganizationGroupEntitiesFromProvider(
    provider,
  );
  const [newDevices, newDeviceEntities] = await fetchDeviceEntitiesFromProvider(
    provider,
  );
  const newUsers = parseDeviceUsers(provider, newDevices);

  const [accountEntity] = newAccountEntities;
  const newAccountRelationships = [
    // Account HAS OrganizationGroups
    ...createAccountRelationships(
      accountEntity,
      newOrganizationGroupEntities,
      ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
      ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
    ),
    // Account MANAGES Devices
    ...createAccountRelationships(
      accountEntity,
      newDeviceEntities,
      ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
      ACCOUNT_DEVICE_RELATIONSHIP_TYPE,
    ),
  ];

  const newOrganizationGroupRelationships = [
    // OrganizationGroup HAS Admins
    ...createOrganizationGroupRelationships(
      newOrganizationGroupEntities,
      newAdminEntities,
      ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE,
    ),
  ];

  const newUserDeviceRelationships = [
    // Device HAS Users
    ...createDeviceUserRelationships(newUsers, newDeviceEntities),
  ];

  return {
    operations: await persister.publishPersisterOperations([
      [
        ...persister.processEntities(oldAccountEntities, newAccountEntities),
        ...persister.processEntities(oldAdminEntities, newAdminEntities),
        ...persister.processEntities(
          oldOrganizationGroupEntities,
          newOrganizationGroupEntities,
        ),
        ...persister.processEntities(oldDeviceEntities, newDeviceEntities),
        ...persister.processEntities(oldUsers, newUsers),
      ],
      [
        ...persister.processRelationships(
          oldAccountRelationships,
          newAccountRelationships,
        ),
        ...persister.processRelationships(
          oldOrganizationGroupRelationships,
          newOrganizationGroupRelationships,
        ),
        ...persister.processRelationships(
          oldUserDeviceRelationships,
          newUserDeviceRelationships,
        ),
      ],
    ]),
  };
}

async function fetchAccountEntities(
  provider: AirwatchClient,
  account: AirWatchAccount,
): Promise<AccountEntity[]> {
  return [createAccountEntity(provider.host, account)];
}

async function fetchOrganizationGroupEntitiesFromProvider(
  provider: AirwatchClient,
): Promise<OrganizationGroupEntity[]> {
  return createOrganizationGroupEntities(
    provider.host,
    await provider.fetchOrganizationGroups(),
  );
}

async function fetchAdminEntitiesFromProvider(
  provider: AirwatchClient,
): Promise<AdminEntity[]> {
  return createAdminEntities(provider.host, await provider.fetchAdmins());
}

async function fetchDeviceEntitiesFromProvider(
  provider: AirwatchClient,
): Promise<[AirWatchDevice[], DeviceEntity[]]> {
  const devices = await provider.fetchDevices();

  return [devices, createDeviceEntities(provider.host, devices)];
}

function parseDeviceUsers(
  provider: AirwatchClient,
  devices: AirWatchDevice[],
): UserEntity[] {
  return createUserEntities(provider.host, provider.parseDeviceUsers(devices));
}

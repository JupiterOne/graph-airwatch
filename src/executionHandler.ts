import {
  EntityFromIntegration,
  getRawData,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
  IntegrationRelationship,
} from "@jupiterone/jupiter-managed-integration-sdk";
import {
  createIntegrationRelationship,
  DataModel,
} from "@jupiterone/data-model";

import {
  AirWatchAdmin,
  AirWatchDevice,
  AirWatchOrganizationGroup,
} from "./airwatch/types";
import initializeContext from "./initializeContext";
import {
  ACCOUNT_DEVICE_RELATIONSHIP_TYPE,
  ACCOUNT_ENTITY_TYPE,
  ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
  ADMIN_ENTITY_TYPE,
  createAccountEntity,
  createAdminEntity,
  createDeviceEntity,
  createOrganizationGroupEntity,
  createUserEntity,
  DEVICE_ENTITY_TYPE,
  DEVICE_USER_ENTITY_TYPE,
  ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE,
  ORGANIZATION_GROUP_ENTITY_TYPE,
  USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_TYPE,
} from "./jupiterone";

export default async function executionHandler(
  context: IntegrationExecutionContext,
): Promise<IntegrationExecutionResult> {
  const { graph, persister, provider, account } = initializeContext(context);

  const [
    oldAccountEntities,
    oldAdminEntities,
    oldOrganizationGroupEntities,
    oldDeviceEntities,
    oldUsers,
  ] = await Promise.all([
    graph.findEntitiesByType(ACCOUNT_ENTITY_TYPE),
    graph.findEntitiesByType(ADMIN_ENTITY_TYPE),
    graph.findEntitiesByType(ORGANIZATION_GROUP_ENTITY_TYPE),
    graph.findEntitiesByType(DEVICE_ENTITY_TYPE),
    graph.findEntitiesByType(DEVICE_USER_ENTITY_TYPE),
  ]);

  const [
    oldAccountRelationships,
    oldOrganizationGroupRelationships,
    oldDeviceUserRelationships,
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

  const newOrganizationGroups = await provider.fetchOrganizationGroups();
  const newAdmins = await provider.fetchAdmins();
  const newDevices = await provider.fetchDevices();

  const newAccountEntity = createAccountEntity(provider.host, account);
  const newOrganizationGroupEntities = newOrganizationGroups.map(e =>
    createOrganizationGroupEntity(provider.host, e),
  );
  const newAdminEntities = newAdmins.map(e =>
    createAdminEntity(provider.host, e),
  );
  const newDeviceEntities = newDevices.map(e =>
    createDeviceEntity(provider.host, e),
  );

  const newAccountOrganizationGroupRelationships: IntegrationRelationship[] = [];
  const newOrganizationGroupAdminRelationships: IntegrationRelationship[] = [];
  for (const groupEntity of newOrganizationGroupEntities) {
    newAccountOrganizationGroupRelationships.push(
      createIntegrationRelationship({
        _class: DataModel.RelationshipClass.HAS,
        from: newAccountEntity,
        to: groupEntity,
      }),
    );

    const group = getRawData(groupEntity) as AirWatchOrganizationGroup;
    for (const adminEntity of newAdminEntities) {
      const admin = getRawData(adminEntity) as AirWatchAdmin;
      if (admin.organizationGroupUuid === group.Uuid) {
        newOrganizationGroupAdminRelationships.push(
          createIntegrationRelationship({
            _class: DataModel.RelationshipClass.HAS,
            from: groupEntity,
            to: adminEntity,
          }),
        );
      }
    }
  }

  const newUserEntities: EntityFromIntegration[] = [];
  const newAccountDeviceRelationships: IntegrationRelationship[] = [];
  const newDeviceUserRelationships: IntegrationRelationship[] = [];
  for (const deviceEntity of newDeviceEntities) {
    newAccountDeviceRelationships.push(
      createIntegrationRelationship({
        _class: DataModel.RelationshipClass.MANAGES,
        from: newAccountEntity,
        to: deviceEntity,
      }),
    );

    const device = getRawData(deviceEntity) as AirWatchDevice;
    const deviceUser = {
      ...device.UserId,
      Id: {
        Value: device.Id.Value,
      },
    };

    const newUserEntity = createUserEntity(provider.host, deviceUser);

    newUserEntities.push(newUserEntity);

    newDeviceUserRelationships.push(
      createIntegrationRelationship({
        _class: DataModel.RelationshipClass.HAS,
        from: deviceEntity,
        to: newUserEntity,
      }),
    );
  }

  return {
    operations: await persister.publishPersisterOperations([
      [
        ...persister.processEntities(oldAccountEntities, [newAccountEntity]),
        ...persister.processEntities(oldAdminEntities, newAdminEntities),
        ...persister.processEntities(
          oldOrganizationGroupEntities,
          newOrganizationGroupEntities,
        ),
        ...persister.processEntities(oldDeviceEntities, newDeviceEntities),
        ...persister.processEntities(oldUsers, newUserEntities),
      ],
      [
        ...persister.processRelationships(
          oldAccountRelationships,
          newAccountOrganizationGroupRelationships,
        ),
        ...persister.processRelationships(
          oldOrganizationGroupRelationships,
          newOrganizationGroupAdminRelationships,
        ),
        ...persister.processRelationships(
          oldDeviceUserRelationships,
          newDeviceUserRelationships,
        ),
      ],
    ]),
  };
}

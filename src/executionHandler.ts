import {
  createIntegrationRelationship,
  EntityFromIntegration,
  getRawData,
  IntegrationExecutionContext,
  IntegrationExecutionResult,
  IntegrationRelationship,
} from "@jupiterone/jupiter-managed-integration-sdk";

import {
  AirWatchAdmin,
  AirWatchDevice,
  AirWatchOrganizationGroup,
} from "./airwatch/types";
import initializeContext from "./initializeContext";
import {
  ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
  ACCOUNT_DEVICE_RELATIONSHIP_TYPE,
  ACCOUNT_ENTITY_TYPE,
  ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
  ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
  ADMIN_ENTITY_TYPE,
  createAccountEntity,
  createAdminEntity,
  createDeviceEntity,
  createOrganizationGroupEntity,
  createUserEntity,
  DEVICE_ENTITY_TYPE,
  DEVICE_USER_ENTITY_TYPE,
  ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_CLASS,
  ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE,
  ORGANIZATION_GROUP_ENTITY_TYPE,
  ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
  ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
  USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_CLASS,
  USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_TYPE,
} from "./jupiterone";

export default async function executionHandler(
  context: IntegrationExecutionContext,
): Promise<IntegrationExecutionResult> {
  const { graph, logger, persister, provider, account } = initializeContext(
    context,
  );

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
    oldOrganizationGroupAdminRelationships,
    oldOrganizationGroupRelationships,
    oldDeviceUserRelationships,
  ] = await Promise.all([
    graph.findRelationshipsByType([
      ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
      ACCOUNT_DEVICE_RELATIONSHIP_TYPE,
    ]),
    graph.findRelationshipsByType([ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE]),
    graph.findRelationshipsByType([ORGANIZATION_GROUP_RELATIONSHIP_TYPE]),
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
  const newOrganizationGroupRelationships: IntegrationRelationship[] = [];

  for (const groupEntity of newOrganizationGroupEntities) {
    newAccountOrganizationGroupRelationships.push(
      createIntegrationRelationship({
        _class: ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
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
            _class: ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_CLASS,
            from: groupEntity,
            to: adminEntity,
          }),
        );
      }
    }

    if (group.Children) {
      for (const childGroup of group.Children) {
        const childGroupEntity = newOrganizationGroupEntities.find(
          e => e._key === childGroup.Uuid,
        );

        if (childGroupEntity) {
          newOrganizationGroupRelationships.push(
            createIntegrationRelationship({
              _class: ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
              from: groupEntity,
              to: childGroupEntity,
            }),
          );
        } else {
          logger.warn(
            {
              group: { id: group.Id, uuid: group.Uuid, name: group.Name },
              child: {
                id: childGroup.Id.Value,
                uuid: childGroup.Uuid,
                name: childGroup.Name,
              },
            },
            "Group refers to child group that was not found",
          );
        }
      }
    }
  }

  const newUserEntities: EntityFromIntegration[] = [];
  const newAccountDeviceRelationships: IntegrationRelationship[] = [];
  const newDeviceUserRelationships: IntegrationRelationship[] = [];
  for (const deviceEntity of newDeviceEntities) {
    newAccountDeviceRelationships.push(
      createIntegrationRelationship({
        _class: ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
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
        _class: USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_CLASS,
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
          oldOrganizationGroupAdminRelationships,
          newOrganizationGroupAdminRelationships,
        ),
        ...persister.processRelationships(
          oldOrganizationGroupRelationships,
          newOrganizationGroupRelationships,
        ),
        ...persister.processRelationships(
          oldDeviceUserRelationships,
          newDeviceUserRelationships,
        ),
      ],
    ]),
  };
}

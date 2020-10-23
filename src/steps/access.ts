import {
  createDirectRelationship,
  Entity,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../client';
import { AirWatchOrganizationGroup } from '../client/types';
import { IntegrationConfig } from '../types';
import { ACCOUNT_ENTITY_KEY } from './account';
import {
  ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
  Entities,
  ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_CLASS,
  ORGANIZATION_GROUP_ENTITY_TYPE,
  ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
  Relationships,
  STEP_FETCH_ACCOUNT,
  STEP_FETCH_ADMINS,
  STEP_FETCH_ORGANIZATION_GROUPS,
} from './constants';
import { createAdminEntity, createOrganizationGroupEntity } from './converters';

export async function fetchOrganizationGroups({
  instance,
  logger,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  const uuidGroupMap: Map<string, string> = new Map();

  await apiClient.iterateOrganizationGroups(async (group) => {
    const groupEntity = await jobState.addEntity(
      createOrganizationGroupEntity(apiClient.host, group),
    );

    // Track all the group keys for parent/child relationships
    uuidGroupMap.set(group.Uuid, groupEntity._key);

    await jobState.addRelationship(
      createDirectRelationship({
        _class: ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
        from: accountEntity,
        to: groupEntity,
      }),
    );
  });

  await jobState.iterateEntities(
    { _type: ORGANIZATION_GROUP_ENTITY_TYPE },
    async (groupEntity) => {
      const groupData = getRawData(groupEntity) as AirWatchOrganizationGroup;
      for (const childGroup of groupData?.Children || []) {
        const childEntityKey = uuidGroupMap.get(childGroup.Uuid);
        if (childEntityKey) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: ORGANIZATION_GROUP_RELATIONSHIP_CLASS,
              fromType: ORGANIZATION_GROUP_ENTITY_TYPE,
              fromKey: groupEntity._key,
              toType: ORGANIZATION_GROUP_ENTITY_TYPE,
              toKey: childEntityKey,
            }),
          );
        } else {
          logger.warn(
            {
              group: {
                id: groupData.Id,
                uuid: groupData.Uuid,
                name: groupData.Name,
              },
              child: {
                id: childGroup.Id.Value,
                uuid: childGroup.Uuid,
                name: childGroup.Name,
              },
            },
            'Group refers to child group that was not found',
          );
        }
      }
    },
  );
}

export async function fetchAdmins({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateAdmins(async (user) => {
    const adminEntity = await jobState.addEntity(
      createAdminEntity(apiClient.host, user),
    );

    const groupEntity = await jobState.findEntity(user.organizationGroupUuid);
    if (groupEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_CLASS,
          from: groupEntity,
          to: adminEntity,
        }),
      );
    }
  });
}

export const accessSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: STEP_FETCH_ORGANIZATION_GROUPS,
    name: 'Fetch Organization Groups',
    entities: [Entities.ORGANIZATION_GROUP],
    relationships: [
      Relationships.ACCOUNT_ORGANIZATION_GROUP,
      Relationships.ORGANIZATION_GROUP_GROUP,
    ],
    dependsOn: [STEP_FETCH_ACCOUNT],
    executionHandler: fetchOrganizationGroups,
  },
  {
    id: STEP_FETCH_ADMINS,
    name: 'Fetch Admins',
    entities: [Entities.ADMIN],
    relationships: [Relationships.ORGANIZATION_GROUP_ADMIN],
    dependsOn: [STEP_FETCH_ACCOUNT, STEP_FETCH_ORGANIZATION_GROUPS],
    executionHandler: fetchAdmins,
  },
];

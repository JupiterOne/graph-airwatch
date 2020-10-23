import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../client';
import { IntegrationConfig } from '../types';
import {
  ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
  Entities,
  Relationships,
  STEP_FETCH_ACCOUNT,
  STEP_FETCH_DEVICES,
  USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_CLASS,
} from './constants';
import { createDeviceEntity, createUserEntity } from './converters';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export async function fetchDevices({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateDevices(async (device) => {
    const deviceEntity = await jobState.addEntity(
      createDeviceEntity(apiClient.host, device),
    );
    await jobState.addRelationship(
      createDirectRelationship({
        _class: ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
        from: accountEntity,
        to: deviceEntity,
      }),
    );

    // TODO: We need more data for the user
    const deviceUser = {
      ...device.UserId,
      Id: {
        Value: device.Id.Value,
      },
    };

    const newUserEntity = await jobState.addEntity(
      createUserEntity(apiClient.host, deviceUser),
    );
    await jobState.addRelationship(
      createDirectRelationship({
        _class: USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_CLASS,
        from: deviceEntity,
        to: newUserEntity,
      }),
    );
  });
}

export const devicesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: STEP_FETCH_DEVICES,
    name: 'Fetch Devices',
    entities: [Entities.USER_ENDPOINT, Entities.DEVICE_USER],
    relationships: [
      Relationships.ACCOUNT_DEVICE,
      Relationships.USER_ENDPOINT_DEVICE_USER,
    ],
    dependsOn: [STEP_FETCH_ACCOUNT],
    executionHandler: fetchDevices,
  },
];

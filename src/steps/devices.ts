import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  JobState,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../client';
import { AirWatchDeviceUser } from '../client/types';
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
  logger,
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  const seenUuids = new Set<string>();
  await apiClient.iterateDevices(async (device) => {
    if (!device.Uuid) {
      logger.warn(
        { device },
        'Uuid property is undefined, types indicate it will always be defined',
      );
    } else if (seenUuids.has(device.Uuid)) {
      logger.warn(
        { device },
        'Device.Uuid seen before, iterateDevices may be seeing duplicates',
      );
    } else {
      let securityDetails;
      try {
        securityDetails = await apiClient.getDeviceSecurityDetails(device.Uuid);
      } catch (error) {
        logger.info(error, 'Error while retrieving securityDetails');
      }

      seenUuids.add(device.Uuid);

      const deviceEntity = await jobState.addEntity(
        createDeviceEntity(apiClient.host, device, securityDetails),
      );
      await jobState.addRelationship(
        createDirectRelationship({
          _class: ACCOUNT_DEVICE_RELATIONSHIP_CLASS,
          from: accountEntity,
          to: deviceEntity,
        }),
      );

      if (device.UserId?.Uuid) {
        // TODO: We need more data for the user
        const deviceUser: AirWatchDeviceUser = {
          Name: device.UserId.Name,
          Uuid: device.UserId.Uuid,
          Id: {
            Value: device.Id.Value,
          },
        };

        const userEntity = await findOrCreateUser(
          apiClient.host,
          jobState,
          deviceUser,
        );

        await jobState.addRelationship(
          createDirectRelationship({
            _class: USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_CLASS,
            from: deviceEntity,
            to: userEntity,
          }),
        );
      }
    }
  });
}

async function findOrCreateUser(
  host: string,
  jobState: JobState,
  deviceUser: AirWatchDeviceUser,
): Promise<Entity> {
  const user = await jobState.findEntity(deviceUser.Uuid);
  if (user) return user;
  return jobState.addEntity(createUserEntity(host, deviceUser));
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

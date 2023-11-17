import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../types';
import {
  DEVICE_ENTITY_TYPE,
  DEVICE_PROFILE_REATIONSHIP_CLASS,
  ORGANIZATION_GROUP_ENTITY_TYPE,
  PROFILE_ENTITY_CLASS,
  PROFILE_ENTITY_TYPE,
  Relationships,
  STEP_BUILD_PROFILE_TO_DEVICE,
  STEP_FETCH_DEVICES,
  STEP_FETCH_ORGANIZATION_GROUPS,
  STEP_FETCH_PROFILES,
} from './constants';
import { createAPIClient } from '../client';
import { createProfileEntity } from './converters';

export async function fetchProfiles({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await jobState.iterateEntities(
    { _type: ORGANIZATION_GROUP_ENTITY_TYPE },
    async (groupEntity) => {
      await apiClient.iterateOrganizationGroupProfiles(async (profile) => {
        const profileEntity = createProfileEntity(apiClient.host, profile);
        if (jobState.hasKey(profileEntity._key)) {
          logger.info(
            { profileKey: profileEntity._key },
            'Duplicated key found',
          );
          return;
        }
        await jobState.addEntity(profileEntity);
      }, groupEntity._key);
    },
  );
}

export async function buildDeviceProfileRelationships({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await jobState.iterateEntities(
    { _type: PROFILE_ENTITY_TYPE },
    async (profileEntity) => {
      try {
        const response = await apiClient.fetchDevicesForProfile(
          profileEntity._key,
        );
        // we don't have a way to test this - I'm using the model provided by the provider
        // Let's try logging.
        for (const device of response.profileAssignedDevices) {
          if (
            device.uuid &&
            profileEntity._key &&
            jobState.hasKey(device.uuid) &&
            jobState.hasKey(profileEntity._key)
          ) {
            await jobState.addRelationship(
              createDirectRelationship({
                _class: DEVICE_PROFILE_REATIONSHIP_CLASS,
                fromKey: device.uuid,
                fromType: DEVICE_ENTITY_TYPE,
                toKey: profileEntity._key,
                toType: PROFILE_ENTITY_TYPE,
              }),
            );
          } else {
            logger.info(
              { fromKey: device.uuid, toKey: profileEntity._key },
              'Could not create a relationship',
            );
          }
        }
      } catch (error) {
        logger.info(
          { error },
          'There was a problem while relating devices and profiles',
        );
      }
    },
  );
}

export const profileSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: STEP_FETCH_PROFILES,
    name: 'Fetch Profile Details',
    entities: [
      {
        resourceName: 'Profile',
        _type: PROFILE_ENTITY_TYPE,
        _class: PROFILE_ENTITY_CLASS,
      },
    ],
    relationships: [],
    dependsOn: [STEP_FETCH_ORGANIZATION_GROUPS],
    executionHandler: fetchProfiles,
  },
  {
    id: STEP_BUILD_PROFILE_TO_DEVICE,
    name: 'Build device and profile relationships',
    entities: [],
    relationships: [Relationships.DEVICE_PROFILE],
    dependsOn: [STEP_FETCH_DEVICES, STEP_FETCH_PROFILES],
    executionHandler: buildDeviceProfileRelationships,
  },
];

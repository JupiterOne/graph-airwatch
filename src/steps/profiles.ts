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
    { _type: DEVICE_ENTITY_TYPE },
    async (deviceEntity) => {
      try {
        const response = await apiClient.fetchProfilesOfDevice(
          deviceEntity.deviceId! as string,
        );
        // we don't have a way to test this - I'm using the model provided by the provider
        // but its not working. Let's try loggin the involved keys.
        logger.info(
          { objectKeys: Object.keys(response) },
          'TEMP - log response keys',
        );
        for (const profile of response.DeviceProfiles) {
          if (
            response.DeviceId.Uuid &&
            profile.Uuid &&
            jobState.hasKey(response.DeviceId.Uuid) &&
            jobState.hasKey(profile.Uuid)
          ) {
            await jobState.addRelationship(
              createDirectRelationship({
                _class: DEVICE_PROFILE_REATIONSHIP_CLASS,
                fromKey: response.DeviceId.Uuid,
                fromType: DEVICE_ENTITY_TYPE,
                toKey: profile.Uuid,
                toType: PROFILE_ENTITY_TYPE,
              }),
            );
          } else {
            logger.info(
              { fromKey: response.DeviceId.Uuid, toKey: profile.Uuid },
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

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
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await jobState.iterateEntities(
    { _type: ORGANIZATION_GROUP_ENTITY_TYPE },
    async (groupEntity) => {
      await apiClient.iterateOrganizationGroupProfiles(async (profile) => {
        await jobState.addEntity(createProfileEntity(apiClient.host, profile));
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
        for (const profile of response.DeviceProfiles) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: DEVICE_PROFILE_REATIONSHIP_CLASS,
              fromKey: response.DeviceId.Uuid,
              fromType: DEVICE_ENTITY_TYPE,
              toKey: profile.Uuid,
              toType: PROFILE_ENTITY_TYPE,
            }),
          );
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

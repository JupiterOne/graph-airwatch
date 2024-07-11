import {
  createIntegrationEntity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../types';
import { Entities, STEP_FETCH_ACCOUNT } from './constants';
import { createAccountAssignEntity } from '../entities';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export async function fetchAccountDetails({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = await jobState.addEntity(
    createIntegrationEntity({
      entityData: {
        source: {
          host: instance.config.airwatchHost,
          username: instance.config.airwatchUsername,
        },
        assign: createAccountAssignEntity({
          _key: `airwatch-${instance.id}`,
          name: instance.config.airwatchHost,
          displayName: instance.config.airwatchHost,
          webLink: `https://${instance.config.airwatchHost}`,
          vendor: 'AirWatch',
        }),
      },
    }),
  );

  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: STEP_FETCH_ACCOUNT,
    name: 'Fetch Account Details',
    entities: [Entities.ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccountDetails,
  },
];

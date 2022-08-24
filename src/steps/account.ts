import {
  createIntegrationEntity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../types';
import {
  ACCOUNT_ENTITY_CLASS,
  ACCOUNT_ENTITY_TYPE,
  STEP_FETCH_ACCOUNT,
} from './constants';

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
        assign: {
          _class: ACCOUNT_ENTITY_CLASS,
          _type: ACCOUNT_ENTITY_TYPE,
          _key: `airwatch-${instance.id}`,
          name: instance.config.airwatchHost,
          webLink: `https://${instance.config.airwatchHost}`,
        },
      },
    }),
  );

  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: STEP_FETCH_ACCOUNT,
    name: 'Fetch Account Details',
    entities: [
      {
        resourceName: 'Account',
        _type: ACCOUNT_ENTITY_TYPE,
        _class: ACCOUNT_ENTITY_CLASS,
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccountDetails,
  },
];

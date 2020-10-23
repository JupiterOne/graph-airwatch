import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from './client';
import { IntegrationConfig } from './types';

export default async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (
    !(
      config.airwatchHost &&
      config.airwatchUsername &&
      config.airwatchPassword &&
      config.airwatchApiKey
    )
  ) {
    throw new IntegrationValidationError(
      'Config requires all of {airwatchHost, airwatchUsername, airwatchPassword, airwatchApiKey}',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}

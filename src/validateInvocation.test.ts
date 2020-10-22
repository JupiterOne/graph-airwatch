import {
  IntegrationProviderAuthenticationError,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { createMockExecutionContext } from '@jupiterone/integration-sdk-testing';

import { setupAirWatchRecording } from '../test/recording';
import { IntegrationConfig } from './types';
import validateInvocation from './validateInvocation';

it('requires valid config', async () => {
  const executionContext = createMockExecutionContext<IntegrationConfig>({
    instanceConfig: {} as IntegrationConfig,
  });

  try {
    await validateInvocation(executionContext);
  } catch (e) {
    expect(e instanceof IntegrationValidationError).toBe(true);
  }
});

it('auth error', async () => {
  const recording = setupAirWatchRecording({
    directory: '__recordings__',
    name: 'client-auth-error',
  });

  recording.server.any().intercept((req, res) => {
    res.status(401);
  });

  const executionContext = createMockExecutionContext<IntegrationConfig>({
    instanceConfig: {
      airwatchHost: 'INVALID',
      airwatchUsername: 'INVALID',
      airwatchPassword: 'INVALID',
      airwatchApiKey: 'INVALID',
    },
  });

  try {
    await validateInvocation(executionContext);
  } catch (e) {
    expect(e instanceof IntegrationProviderAuthenticationError).toBe(true);
  }
});

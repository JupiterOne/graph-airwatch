import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';

import { setupAirWatchRecording } from '../../test/recording';
import { IntegrationConfig } from '../types';
import validateInvocation from '../validateInvocation';
import { fetchAdmins, fetchOrganizationGroups } from './access';
import { fetchAccountDetails } from './account';
import { fetchDevices } from './devices';

const integrationConfig: IntegrationConfig = {
  airwatchHost: process.env.AIRWATCH_HOST || 'as1380.awmdm.com',
  airwatchUsername: process.env.AIRWATCH_USERNAME || 'jupiterone-dev',
  airwatchPassword: process.env.AIRWATCH_PASSWORD || 'top-secret',
  airwatchApiKey: process.env.AIRWATCH_API_KEY || 'abc123',
};

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('should collect data', async () => {
  recording = setupAirWatchRecording({
    directory: __dirname,
    name: 'steps',
  });

  const context = createMockStepExecutionContext<IntegrationConfig>({
    instanceConfig: integrationConfig,
  });

  // Simulates dependency graph execution.
  // See https://github.com/JupiterOne/sdk/issues/262.
  await validateInvocation(context);
  await fetchAccountDetails(context);
  await fetchOrganizationGroups(context);
  await fetchAdmins(context);
  await fetchDevices(context);

  // Review snapshot, failure is a regression
  expect({
    numCollectedEntities: context.jobState.collectedEntities.length,
    numCollectedRelationships: context.jobState.collectedRelationships.length,
    collectedEntities: context.jobState.collectedEntities,
    collectedRelationships: context.jobState.collectedRelationships,
    encounteredTypes: context.jobState.encounteredTypes,
  }).toMatchSnapshot();

  const accounts = context.jobState.collectedEntities.filter((e) =>
    e._class.includes('Account'),
  );
  expect(accounts.length).toBeGreaterThan(0);
  expect(accounts).toMatchGraphObjectSchema({
    _class: ['Account'],
    schema: {
      additionalProperties: false,
      properties: {
        _type: { const: 'airwatch_account' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  });

  const users = context.jobState.collectedEntities.filter(
    (e) => e._type === 'airwatch_user',
  );
  expect(users.length).toBeGreaterThan(0);
  expect(users).toMatchGraphObjectSchema({
    _class: ['User'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'airwatch_user' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string' },
        admin: { type: 'boolean' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: ['email'],
    },
  });

  const userGroups = context.jobState.collectedEntities.filter((e) =>
    e._class.includes('UserGroup'),
  );
  expect(userGroups.length).toBeGreaterThan(0);
  expect(userGroups).toMatchGraphObjectSchema({
    _class: ['Group', 'UserGroup'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'airwatch_group' },
        name: { type: 'string' },
        webLink: {
          type: 'string',
          format: 'url',
        },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: ['webLink'],
    },
  });
});

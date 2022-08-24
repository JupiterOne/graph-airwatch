import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk-core';

const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  airwatchApiKey: {
    type: 'string',
    mask: true,
  },
  airwatchUsername: {
    type: 'string',
  },
  airwatchPassword: {
    type: 'string',
    mask: true,
  },
  airwatchHost: {
    type: 'string',
  },
};

export default instanceConfigFields;

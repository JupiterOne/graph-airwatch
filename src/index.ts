import { IntegrationInvocationConfig } from "@jupiterone/jupiter-managed-integration-sdk";

import executionHandler from "./executionHandler";
import invocationValidator from "./invocationValidator";

export const invocationConfig: IntegrationInvocationConfig = {
  instanceConfigFields: {
    airwatchApiKey: {
      type: "string",
      mask: true,
    },
    airwatchUsername: {
      type: "string",
    },
    airwatchPassword: {
      type: "string",
      mask: true,
    },
    airwatchHost: {
      type: "string",
    },
  },

  invocationValidator,

  integrationStepPhases: [
    {
      steps: [
        {
          id: "synchronize",
          name: "Synchronize",
          executionHandler,
        },
      ],
    },
  ],
};

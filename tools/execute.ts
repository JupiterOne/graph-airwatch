/* tslint:disable:no-console */
import { executeIntegrationLocal } from "@jupiterone/jupiter-managed-integration-sdk";
import { invocationConfig } from "../src/index";

const integrationConfig = {
  airwatchApiKey: process.env.AIRWATCH_LOCAL_EXECUTION_API_TOKEN,
  airwatchUsername: process.env.AIRWATCH_LOCAL_EXECUTION_USERNAME,
  airwatchPassword: process.env.AIRWATCH_LOCAL_EXECUTION_PASSWORD,
  airwatchHost: process.env.AIRWATCH_LOCAL_EXECUTION_HOST,
};

const invocationArgs = {
  // providerPrivateKey: process.env.PROVIDER_LOCAL_EXECUTION_PRIVATE_KEY
};

executeIntegrationLocal(
  integrationConfig,
  invocationConfig,
  invocationArgs,
).catch(err => {
  console.error(err);
  process.stdout.end(() => {
    process.exit(1);
  });
});

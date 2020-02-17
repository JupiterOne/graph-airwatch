import { IntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";
import AirwatchClient from "./ProviderClient";
import { ExampleExecutionContext } from "./types";

export default function initializeContext(
  context: IntegrationExecutionContext,
): ExampleExecutionContext {
  const { config } = context.instance;

  const provider = new AirwatchClient(
    config.airwatchHost,
    config.airwatchUsername,
    config.airwatchPassword,
    config.airwatchApiKey,
  );

  return {
    ...context,
    ...context.clients.getClients(),
    provider,
  };
}

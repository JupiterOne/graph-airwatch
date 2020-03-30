import { IntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";
import AirwatchClient from "./airwatch/AirwatchClient";
import { AirwatchExecutionContext } from "./types";
import { AirWatchAccount } from "./airwatch/types";

export default function initializeContext(
  context: IntegrationExecutionContext,
): AirwatchExecutionContext {
  const { config } = context.instance;

  const provider = new AirwatchClient(
    config.airwatchHost,
    config.airwatchUsername,
    config.airwatchPassword,
    config.airwatchApiKey,
  );

  const account: AirWatchAccount = {
    uuid: `${config.airwatchHost}/${config.airwatchUsername}`,
    name: config.airwatchHost,
  };

  return {
    ...context,
    ...context.clients.getClients(),
    provider,
    account,
  };
}

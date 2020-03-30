/* eslint-disable @typescript-eslint/require-await */

import {
  IntegrationValidationContext,
  IntegrationInstanceConfigError,
  IntegrationInstanceAuthenticationError,
} from "@jupiterone/jupiter-managed-integration-sdk";

import AirwatchClient from "./airwatch/AirwatchClient";

/**
 * Performs validation of the execution before the execution handler function is
 * invoked.
 *
 * At a minimum, integrations should ensure that the
 * `context.instance.config` is valid. Integrations that require
 * additional information in `context.invocationArgs` should also
 * validate those properties. It is also helpful to perform authentication with
 * the provider to ensure that credentials are valid.
 *
 * The function will be awaited to support connecting to the provider for this
 * purpose.
 *
 * @param context
 */
export default async function invocationValidator(
  context: IntegrationValidationContext,
): Promise<void> {
  const { config } = context.instance;
  if (
    !config.airwatchHost ||
    !config.airwatchUsername ||
    !config.airwatchPassword ||
    !config.airwatchApiKey
  ) {
    throw new IntegrationInstanceConfigError(
      "config requires all of { airwatchHost, airwatchUsername, airwatchPassword, airwatchApiKey }",
    );
  }

  const provider = new AirwatchClient(
    config.airwatchHost,
    config.airwatchUsername,
    config.airwatchPassword,
    config.airwatchApiKey,
  );

  try {
    await provider.fetchAdmins();
  } catch (err) {
    throw new IntegrationInstanceAuthenticationError(err);
  }
}

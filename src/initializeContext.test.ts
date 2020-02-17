import { createTestIntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";
import initializeContext from "./initializeContext";

test("creates provider client", () => {
  const options = {
    instance: {
      config: {
        airwatchHost: "",
        airwatchUsername: "",
        airwatchPassword: "",
        airwatchApiKey: "",
      },
    },
  };
  const executionContext = createTestIntegrationExecutionContext(options);
  const integrationContext = initializeContext(executionContext);
  expect(integrationContext.provider).toBeDefined();
});

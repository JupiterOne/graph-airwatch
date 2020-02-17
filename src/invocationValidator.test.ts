import invocationValidator from "./invocationValidator";

test("it should throw IntegrationInstanceConfigError when missing some configuration options", async () => {
  const context = {
    config: {},
  } as any;

  await expect(invocationValidator(context)).rejects.toThrow();
});

module.exports = {
  ...require('@jupiterone/integration-sdk-dev-tools/config/jest'),
  setupFiles: ['dotenv/config', './jest.env.js'],
  testTimeout: 20_000,
};

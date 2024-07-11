import { createIntegrationHelpers } from '@jupiterone/integration-sdk-core';
import { typeboxClassSchemaMap } from '@jupiterone/data-model';

export const {
  createEntityType,
  createEntityMetadata,
  createMultiClassEntityMetadata,
} = createIntegrationHelpers({
  integrationName: 'airwatch',
  classSchemaMap: typeboxClassSchemaMap,
});

import { IntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";
import executionHandler from "./executionHandler";
import initializeContext from "./initializeContext";

import { DEVICE_ENTITY_TYPE } from "./jupiterone/entities/DeviceEntity";
import { ACCOUNT_ENTITY_TYPE } from "./jupiterone/entities/AccountEntity";
import { ADMIN_ENTITY_TYPE } from "./jupiterone/entities/AdminEntity";
import { ORGANIZATION_GROUP_ENTITY_TYPE } from "./jupiterone/entities/OrganizationGroupEntity";
import { DEVICE_USER_ENTITY_TYPE } from "./jupiterone/entities/UserEntity";

import { ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE } from "./jupiterone/relationships/AccountOrganizationGroupRelationship";
import { ACCOUNT_DEVICE_RELATIONSHIP_TYPE } from "./jupiterone/relationships/AccountDeviceRelationship";
import { ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE } from "./jupiterone/relationships/OrganizationGroupAdminRelationship";
import { USER_DEVICE_RELATIONSHIP_TYPE } from "./jupiterone/relationships/UserDeviceRelationship";

jest.mock("./initializeContext");

test("executionHandler", async () => {
  const executionContext = {
    graph: {
      findEntitiesByType: jest.fn().mockResolvedValue([]),
      findRelationshipsByType: jest.fn().mockResolvedValue([]),
    },
    persister: {
      processEntities: jest.fn().mockReturnValue([]),
      processRelationships: jest.fn().mockReturnValue([]),
      publishPersisterOperations: jest.fn().mockResolvedValue({}),
    },
    provider: {
      fetchDevices: jest.fn().mockReturnValue([]),
      fetchAdmins: jest.fn().mockReturnValue([]),
      fetchOrganizationGroups: jest.fn().mockReturnValue([]),
      parseDeviceUsers: jest.fn().mockReturnValue([]),
    },
    account: {
      uuid: "testUuid",
      name: "testName",
    },
  };

  (initializeContext as jest.Mock).mockReturnValue(executionContext);

  const invocationContext = {} as IntegrationExecutionContext;
  await executionHandler(invocationContext);

  expect(initializeContext).toHaveBeenCalledWith(invocationContext);
  expect(executionContext.graph.findEntitiesByType).toHaveBeenCalledWith(
    ACCOUNT_ENTITY_TYPE,
  );
  expect(executionContext.graph.findEntitiesByType).toHaveBeenCalledWith(
    ADMIN_ENTITY_TYPE,
  );
  expect(executionContext.graph.findEntitiesByType).toHaveBeenCalledWith(
    ORGANIZATION_GROUP_ENTITY_TYPE,
  );
  expect(executionContext.graph.findEntitiesByType).toHaveBeenCalledWith(
    DEVICE_ENTITY_TYPE,
  );
  expect(executionContext.graph.findEntitiesByType).toHaveBeenCalledWith(
    DEVICE_USER_ENTITY_TYPE,
  );

  expect(executionContext.graph.findRelationshipsByType).toHaveBeenCalledWith([
    ACCOUNT_ORGANIZATION_GROUP_RELATIONSHIP_TYPE,
    ACCOUNT_DEVICE_RELATIONSHIP_TYPE,
  ]);
  expect(executionContext.graph.findRelationshipsByType).toHaveBeenCalledWith([
    ORGANIZATION_GROUP_ADMIN_RELATIONSHIP_TYPE,
  ]);
  expect(executionContext.graph.findRelationshipsByType).toHaveBeenCalledWith([
    USER_DEVICE_RELATIONSHIP_TYPE,
  ]);

  expect(executionContext.provider.fetchDevices).toHaveBeenCalledTimes(1);
  expect(executionContext.provider.fetchAdmins).toHaveBeenCalledTimes(1);
  expect(
    executionContext.provider.fetchOrganizationGroups,
  ).toHaveBeenCalledTimes(1);
  expect(executionContext.provider.parseDeviceUsers).toHaveBeenCalledTimes(1);

  expect(executionContext.persister.processEntities).toHaveBeenCalledTimes(5);
  expect(executionContext.persister.processRelationships).toHaveBeenCalledTimes(
    3,
  );
  expect(
    executionContext.persister.publishPersisterOperations,
  ).toHaveBeenCalledTimes(1);
});

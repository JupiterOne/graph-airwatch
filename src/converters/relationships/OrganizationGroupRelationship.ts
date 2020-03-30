import {
  EntityFromIntegration,
  RelationshipFromIntegration,
} from "@jupiterone/jupiter-managed-integration-sdk";
import { OrganizationGroupEntity } from "../../jupiterone/entities/OrganizationGroupEntity";
import { AdminEntity } from "../../jupiterone/entities/AdminEntity";

export function createOrganizationGroupRelationship(
  organizationGroup: OrganizationGroupEntity,
  entity: EntityFromIntegration,
  type: string,
): RelationshipFromIntegration {
  return {
    _class: "HAS",
    _fromEntityKey: organizationGroup._key,
    _key: `${organizationGroup._key}_has_${entity._key}`,
    _toEntityKey: entity._key,
    _type: type,
  };
}

export function createOrganizationGroupRelationships(
  organizationGroups: OrganizationGroupEntity[],
  entities: AdminEntity[],
  type: string,
): RelationshipFromIntegration[] {
  const relationships = [];

  for (const organizationGroup of organizationGroups) {
    for (const entity of entities) {
      if (entity.organizationGroupUuid === organizationGroup.uuid) {
        relationships.push(
          createOrganizationGroupRelationship(organizationGroup, entity, type),
        );
      }
    }
  }

  return relationships;
}

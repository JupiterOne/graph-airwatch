import {
  EntityFromIntegration,
  RelationshipFromIntegration,
} from "@jupiterone/jupiter-managed-integration-sdk";
import { AccountEntity } from "../../jupiterone/entities/AccountEntity";

export function createAdminRelationship(
  account: AccountEntity,
  entity: EntityFromIntegration,
  type: string,
): RelationshipFromIntegration {
  return {
    _class: "HAS",
    _fromEntityKey: account._key,
    _key: `${account._key}_has_${entity._key}`,
    _toEntityKey: entity._key,
    _type: type,
  };
}

export function createAdminRelationships(
  account: AccountEntity,
  entities: EntityFromIntegration[],
  type: string,
): RelationshipFromIntegration[] {
  const relationships = [];
  for (const entity of entities) {
    relationships.push(createAdminRelationship(account, entity, type));
  }

  return relationships;
}

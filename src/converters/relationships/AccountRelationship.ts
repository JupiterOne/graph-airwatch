import {
  EntityFromIntegration,
  RelationshipFromIntegration,
} from "@jupiterone/jupiter-managed-integration-sdk";
import { AccountEntity } from "../../jupiterone/entities/AccountEntity";

export function createAccountRelationship(
  account: AccountEntity,
  entity: EntityFromIntegration,
  clazz: string,
  type: string,
): RelationshipFromIntegration {
  return {
    _class: clazz,
    _fromEntityKey: account._key,
    _key: `${account._key}_${clazz.toLowerCase()}_${entity._key}`,
    _toEntityKey: entity._key,
    _type: type,
  };
}

export function createAccountRelationships(
  account: AccountEntity,
  entities: EntityFromIntegration[],
  clazz: string,
  type: string,
): RelationshipFromIntegration[] {
  const relationships = [];

  for (const entity of entities) {
    relationships.push(createAccountRelationship(account, entity, clazz, type));
  }

  return relationships;
}

import { AirWatchAccount } from "../../airwatch/types";
import {
  AccountEntity,
  ACCOUNT_ENTITY_CLASS,
  ACCOUNT_ENTITY_TYPE,
} from "../../jupiterone/entities/AccountEntity";

export function createAccountEntity(
  host: string,
  data: AirWatchAccount,
): AccountEntity {
  return {
    _class: ACCOUNT_ENTITY_CLASS,
    _key: `airwatch-account-${data.uuid}`,
    _type: ACCOUNT_ENTITY_TYPE,
    uuid: data.uuid,
    name: data.name,
    webLink: `https://${host}`,
  };
}

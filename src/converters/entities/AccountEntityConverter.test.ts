import { createAccountEntity } from "./AccountEntityConverter";
import {
  ACCOUNT_ENTITY_CLASS,
  ACCOUNT_ENTITY_TYPE,
} from "../../jupiterone/entities/AccountEntity";

test("createAccountEntity", () => {
  expect(
    createAccountEntity("host", {
      uuid: "uuid-1",
      name: "Account Name",
    }),
  ).toStrictEqual({
    _class: ACCOUNT_ENTITY_CLASS,
    _key: "airwatch-account-uuid-1",
    _type: ACCOUNT_ENTITY_TYPE,
    uuid: "uuid-1",
    name: "Account Name",
    webLink: "https://host",
  });
});

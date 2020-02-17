import { AirWatchAdmin } from "../../airwatch/types";
import {
  AdminEntity,
  ADMIN_ENTITY_CLASS,
  ADMIN_ENTITY_TYPE,
} from "../../jupiterone/entities/AdminEntity";
import { createAdminEntities } from "./AdminEntityConverter";

test("createAdminEntities", () => {
  const airwatchAdmins: AirWatchAdmin[] = [
    {
      uuid: "admin-1",
      organizationGroupUuid: "admins",
      username: "admin1",
      firstName: "Super",
      lastName: "Admin",
      email: "super@admin.com",
      displayName: "Super Admin",
    },
  ];

  const result: AdminEntity[] = createAdminEntities("host", airwatchAdmins);

  expect(result[0]).toStrictEqual({
    _key: "airwatch-admin-admin-1",
    _type: ADMIN_ENTITY_TYPE,
    _scope: ADMIN_ENTITY_TYPE,
    _class: ADMIN_ENTITY_CLASS,
    _rawData: [{ name: "default", rawData: airwatchAdmins[0] }],
    uuid: "admin-1",
    organizationGroupUuid: "admins",
    username: "admin1",
    firstName: "Super",
    lastName: "Admin",
    displayName: "Super Admin",
    email: "super@admin.com",
    webLink: "https://host/AirWatch/#/Admin/List",
    admin: true,
  });
});

test("createAdminEntities without firstName/lastName", () => {
  const airwatchAdmins: AirWatchAdmin[] = [
    {
      uuid: "admin-1",
      organizationGroupUuid: "admins",
      username: "admin1",
      firstName: "",
      lastName: "",
      email: "super@admin.com",
      displayName: "Super Admin",
    },
  ];

  const result: AdminEntity[] = createAdminEntities("host", airwatchAdmins);

  expect(result[0]).toStrictEqual({
    _key: "airwatch-admin-admin-1",
    _type: ADMIN_ENTITY_TYPE,
    _scope: ADMIN_ENTITY_TYPE,
    _class: ADMIN_ENTITY_CLASS,
    _rawData: [{ name: "default", rawData: airwatchAdmins[0] }],
    uuid: "admin-1",
    organizationGroupUuid: "admins",
    username: "admin1",
    firstName: "",
    lastName: "",
    displayName: "admin1",
    email: "super@admin.com",
    webLink: "https://host/AirWatch/#/Admin/List",
    admin: true,
  });
});

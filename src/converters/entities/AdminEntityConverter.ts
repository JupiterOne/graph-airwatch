import { AirWatchAdmin } from "../../airwatch/types";
import {
  AdminEntity,
  ADMIN_ENTITY_CLASS,
  ADMIN_ENTITY_TYPE,
} from "../../jupiterone/entities/AdminEntity";

function createDisplayName(admin: AirWatchAdmin): string {
  return admin.firstName && admin.lastName
    ? `${admin.firstName} ${admin.lastName}`
    : admin.username;
}

export function createAdminEntities(
  host: string,
  data: AirWatchAdmin[],
): AdminEntity[] {
  return data.map(item => ({
    _key: `airwatch-admin-${item.uuid}`,
    _type: ADMIN_ENTITY_TYPE,
    _scope: ADMIN_ENTITY_TYPE,
    _class: ADMIN_ENTITY_CLASS,
    _rawData: [{ name: "default", rawData: item }],
    uuid: item.uuid,
    organizationGroupUuid: item.organizationGroupUuid,
    username: item.username,
    firstName: item.firstName,
    lastName: item.lastName,
    displayName: createDisplayName(item),
    email: item.email,
    webLink: `https://${host}/AirWatch/#/Admin/List`,
    admin: true,
  }));
}

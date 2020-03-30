import { AirWatchOrganizationGroup } from "../../airwatch/types";
import {
  OrganizationGroupEntity,
  ORGANIZATION_GROUP_ENTITY_CLASS,
  ORGANIZATION_GROUP_ENTITY_TYPE,
} from "../../jupiterone/entities/OrganizationGroupEntity";
import { parseDatetime } from "../../utils";

export function createOrganizationGroupEntities(
  host: string,
  data: AirWatchOrganizationGroup[],
): OrganizationGroupEntity[] {
  return data.map(item => ({
    _class: ORGANIZATION_GROUP_ENTITY_CLASS,
    _key: `airwatch-user-group-id-${item.Uuid}`,
    _type: ORGANIZATION_GROUP_ENTITY_TYPE,
    _rawData: [{ name: "default", rawData: item }],
    uuid: item.Uuid,
    name: item.Name,
    locationGroupType: item.LocationGroupType,
    groupId: item.Id,
    country: item.Country,
    displayName: item.Name,
    webLink: `https://${host}/AirWatch/#/AirWatch/OrganizationGroup/Details/Index/${item.Id}`,
    createdOn: parseDatetime(item.CreatedOn),
  }));
}

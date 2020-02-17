import { AirWatchOrganizationGroup } from "../../airwatch/types";
import {
  OrganizationGroupEntity,
  ORGANIZATION_GROUP_ENTITY_CLASS,
  ORGANIZATION_GROUP_ENTITY_TYPE,
} from "../../jupiterone/entities/OrganizationGroupEntity";
import { createOrganizationGroupEntities } from "./OrganizationGroupEntityConverter";

test("createOrganizationGroupEntities", () => {
  const organizationGroups: AirWatchOrganizationGroup[] = [
    {
      Id: 123,
      Uuid: "org-1",
      Name: "Organization",
      GroupId: "group-1",
      LocationGroupType: "type-1",
      Country: "FI",
      WebLink: "None",
      CreatedOn: "3/19/2020 12:19:56 AM",
    },
  ];

  const result: OrganizationGroupEntity[] = createOrganizationGroupEntities(
    "as1300.awmdm.com",
    organizationGroups,
  );

  const expectedResult = result[0];
  delete expectedResult.createdOn;

  expect(expectedResult).toStrictEqual({
    _class: ORGANIZATION_GROUP_ENTITY_CLASS,
    _key: "airwatch-user-group-id-org-1",
    _type: ORGANIZATION_GROUP_ENTITY_TYPE,
    _rawData: [
      {
        name: "default",
        rawData: {
          Country: "FI",
          CreatedOn: "3/19/2020 12:19:56 AM",
          GroupId: "group-1",
          Id: 123,
          LocationGroupType: "type-1",
          Name: "Organization",
          Uuid: "org-1",
          WebLink: "None",
        },
      },
    ],
    uuid: "org-1",
    name: "Organization",
    locationGroupType: "type-1",
    groupId: 123,
    country: "FI",
    displayName: "Organization",
    webLink:
      "https://as1300.awmdm.com/AirWatch/#/AirWatch/OrganizationGroup/Details/Index/123",
  });
});

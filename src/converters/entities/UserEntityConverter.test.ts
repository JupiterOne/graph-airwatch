import { AirWatchDeviceUser } from "../../airwatch/types";
import {
  UserEntity,
  DEVICE_USER_ENTITY_CLASS,
  DEVICE_USER_ENTITY_TYPE,
} from "../../jupiterone/entities/UserEntity";
import { createUserEntities } from "./UserEntityConverter";

test("createUserEntities", () => {
  const deviceUsers: AirWatchDeviceUser[] = [
    {
      Id: {
        Value: 123,
      },
      Uuid: "uuid-1",
      Name: "name-1",
    },
  ];

  const result: UserEntity[] = createUserEntities("host", deviceUsers);

  expect(result[0]).toStrictEqual({
    _class: DEVICE_USER_ENTITY_CLASS,
    _key: "airwatch-user-uuid-1",
    _type: DEVICE_USER_ENTITY_TYPE,
    _rawData: [
      {
        name: "default",
        rawData: {
          Id: {
            Value: 123,
          },
          Name: "name-1",
          Uuid: "uuid-1",
        },
      },
    ],
    name: "name-1",
    uuid: "uuid-1",
    webLink: "https://host/AirWatch/#/AirWatch/User/Details/Summary/123",
  });
});

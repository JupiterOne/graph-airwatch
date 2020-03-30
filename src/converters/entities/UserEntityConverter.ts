import { AirWatchDeviceUser } from "../../airwatch/types";
import {
  UserEntity,
  DEVICE_USER_ENTITY_CLASS,
  DEVICE_USER_ENTITY_TYPE,
} from "../../jupiterone/entities/UserEntity";

export function createUserEntities(
  host: string,
  data: AirWatchDeviceUser[],
): UserEntity[] {
  return data.map(item => ({
    _class: DEVICE_USER_ENTITY_CLASS,
    _key: `airwatch-user-${item.Uuid}`,
    _type: DEVICE_USER_ENTITY_TYPE,
    _rawData: [{ name: "default", rawData: item }],
    name: item.Name,
    uuid: item.Uuid,
    webLink: `https://${host}/AirWatch/#/AirWatch/User/Details/Summary/${item.Id.Value}`,
  }));
}

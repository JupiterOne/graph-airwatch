import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

import { DeviceEntity } from "../../jupiterone/entities/DeviceEntity";
import { UserEntity } from "../../jupiterone/entities/UserEntity";
import { USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_TYPE } from "../../jupiterone/relationships/DeviceUserRelationship";

export function createDeviceUserRelationships(
  deviceUsers: UserEntity[],
  devices: DeviceEntity[],
): RelationshipFromIntegration[] {
  const relationships = [];

  for (const deviceUser of deviceUsers) {
    for (const device of devices) {
      if (device.ownerId === deviceUser.uuid) {
        relationships.push(createDeviceUserRelationship(deviceUser, device));
      }
    }
  }

  return relationships;
}

export function createDeviceUserRelationship(
  deviceUser: UserEntity,
  device: DeviceEntity,
): RelationshipFromIntegration {
  return {
    _class: "HAS",
    _fromEntityKey: device._key,
    _key: `${device._key}_has_${deviceUser._key}`,
    _toEntityKey: deviceUser._key,
    _type: USER_ENDPOINT_DEVICE_USER_RELATIONSHIP_TYPE,
  };
}

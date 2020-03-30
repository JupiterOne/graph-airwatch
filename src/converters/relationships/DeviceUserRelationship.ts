import { RelationshipFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";
import { UserEntity } from "../../jupiterone/entities/UserEntity";
import { DeviceEntity } from "../../jupiterone/entities/DeviceEntity";

export function createDeviceUserRelationships(
  deviceUsers: UserEntity[],
  devices: DeviceEntity[],
  type: string,
): RelationshipFromIntegration[] {
  const relationships = [];

  for (const deviceUser of deviceUsers) {
    for (const device of devices) {
      if (device.ownerId === deviceUser.uuid) {
        relationships.push(
          createDeviceUserRelationship(deviceUser, device, type),
        );
      }
    }
  }

  return relationships;
}

export function createDeviceUserRelationship(
  deviceUser: UserEntity,
  device: DeviceEntity,
  type: string,
): RelationshipFromIntegration {
  return {
    _class: "HAS",
    _fromEntityKey: device._key,
    _key: `${device._key}_has_${deviceUser._key}`,
    _toEntityKey: deviceUser._key,
    _type: type,
  };
}

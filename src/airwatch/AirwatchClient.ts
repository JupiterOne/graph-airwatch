import fetch, { RequestInit, Response } from "node-fetch";

import {
  AirWatchAdmin,
  AirWatchDevice,
  AirWatchOrganizationGroup,
  HttpMethod,
  AirWatchDeviceUser,
  AirWatchDevicesResponse,
  AirWatchAdminsResponse,
  AirWatchOrganizationGroupsResponse,
} from "./types";

export default class AirwatchClient {
  private readonly _host: string;
  private readonly username: string;
  private readonly password: string;
  private readonly apiKey: string;

  constructor(
    host: string,
    username: string,
    password: string,
    apiKey: string,
  ) {
    this._host = host;
    this.username = username;
    this.password = password;
    this.apiKey = apiKey;
  }

  public get host(): string {
    return this._host;
  }

  public async fetchDevices(): Promise<AirWatchDevice[]> {
    const responses: AirWatchDevicesResponse[] = await this.makePaginatedRequest(
      "/mdm/devices/search",
      HttpMethod.GET,
      (response: AirWatchDevicesResponse) =>
        response && response.Devices && response.Devices.length > 0,
      {},
    );

    const devices = responses.reduce(
      (acc: AirWatchDevice[], curr: AirWatchDevicesResponse) => [
        ...acc,
        ...(curr.Devices ? curr.Devices : []),
      ],
      [],
    );

    return devices;
  }

  public parseDeviceUsers(devices: AirWatchDevice[]): AirWatchDeviceUser[] {
    const users: { [uuid: string]: AirWatchDeviceUser } = {};

    for (const device of devices) {
      if (!users[device.UserId.Uuid]) {
        users[device.UserId.Uuid] = {
          ...device.UserId,
          Id: {
            Value: device.Id.Value,
          },
        };
      }
    }

    return Object.values(users);
  }

  public async fetchAdmins(): Promise<AirWatchAdmin[]> {
    const responses: AirWatchAdminsResponse[] = await this.makePaginatedRequest(
      "/system/admins/search",
      HttpMethod.GET,
      (response: AirWatchAdminsResponse) =>
        response && response.admins && response.admins.length > 0,
      {},
    );

    const admins = responses.reduce(
      (acc: AirWatchAdmin[], curr: AirWatchAdminsResponse) => [
        ...acc,
        ...(curr.admins ? curr.admins : []),
      ],
      [],
    );

    return admins;
  }

  public async fetchOrganizationGroups(): Promise<AirWatchOrganizationGroup[]> {
    const responses: AirWatchOrganizationGroupsResponse[] = await this.makePaginatedRequest(
      "/system/groups/search",
      HttpMethod.GET,
      (response: AirWatchOrganizationGroupsResponse) =>
        response &&
        response.OrganizationGroups &&
        response.OrganizationGroups.length > 0,
      {},
    );

    const organizationGroups = responses.reduce(
      (
        acc: AirWatchOrganizationGroup[],
        curr: AirWatchOrganizationGroupsResponse,
      ) => [
        ...acc,
        ...(curr.OrganizationGroups ? curr.OrganizationGroups : []),
      ],
      [],
    );

    return organizationGroups;
  }

  private async makeRequest<T>(
    url: string,
    method: HttpMethod,
    params: {},
    headers?: {},
  ): Promise<T> {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json;version=2",
        Authorization: `Basic ${Buffer.from(
          this.username + ":" + this.password,
        ).toString("base64")}`,
        "aw-tenant-code": this.apiKey,
        ...headers,
      },
    };

    const response: Response | undefined = await fetch(
      `https://${this._host}/api${url}`,
      options,
    );
    if (!response) {
      throw new Error(`No response from 'https://${this._host}/api${url}'`);
    }

    if (response.status.toString().startsWith("2")) {
      const responseBody: string = await response.text();

      return responseBody.length > 0 ? JSON.parse(responseBody) : {};
    } else {
      throw Object.assign(new Error(), {
        message: response.statusText,
        code: "UnexpectedStatusCode",
        statusCode: response.status,
      });
    }
  }

  private async makePaginatedRequest<T>(
    url: string,
    method: HttpMethod,
    responseContinuer: (response: T) => boolean,
    params: {},
    headers?: {},
  ): Promise<T[]> {
    const results: T[] = [];
    let response: T | undefined = undefined;
    let page = 0;

    do {
      response = await this.makeRequest(
        `${url}?page=${page++}`,
        method,
        params,
        headers,
      );

      if (response) {
        results.push(response);
      }
    } while (response && responseContinuer(response));

    return results;
  }
}

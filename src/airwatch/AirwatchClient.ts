import fetch, { RequestInit, Response } from "node-fetch";

import { Account, Device, User, AdminsResponse, HttpMethod } from "./types";

export default class AirwatchClient {
  private readonly host: string;
  private readonly username: string;
  private readonly password: string;
  private readonly apiKey: string;

  constructor(
    host: string,
    username: string,
    password: string,
    apiKey: string,
  ) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.apiKey = apiKey;
  }

  public async fetchAccountDetails(): Promise<Account> {
    const response = await this.makeRequest<AdminsResponse>(
      "/system/admins/search",
      HttpMethod.GET,
      {},
    );

    return response.admins[0];
  }

  public fetchDevices(): Device[] {
    return [
      {
        uuid: "device-a",
        manufacturer: "Manufacturer A",
        ownerId: "user-a",
      },
      {
        uuid: "device-b",
        manufacturer: "Manufacturer B",
        ownerId: "user-b",
      },
    ];
  }

  public fetchUsers(): User[] {
    return [
      {
        firstName: "User",
        uuid: "user-a",
        lastName: "A",
      },
      {
        firstName: "User",
        uuid: "user-b",
        lastName: "B",
      },
    ];
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
      `https://${this.host}/api${url}`,
      options,
    );
    if (!response) {
      throw new Error(`No response from 'https://${this.host}/api${url}'`);
    }

    if (response.status === 200) {
      return response.json();
    } else {
      throw Object.assign(new Error(), {
        message: response.statusText,
        code: "UnexpectedStatusCode",
        statusCode: response.status,
      });
    }
  }
}

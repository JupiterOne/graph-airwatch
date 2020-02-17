import fetch, { RequestInit, Response } from "node-fetch";

export interface Accounts {
  admins: AdminAccount[];
}

export interface AdminAccount {
  uuid: string;
  firstName: string;
  lastName: string;
}

export interface Account {
  id: string;
  name: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Device {
  id: string;
  manufacturer: string;
  ownerId: string;
}

enum Method {
  GET = "get",
  POST = "post",
}

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
    const response = await this.makeRequest<Accounts>(
      "/system/admins/search",
      Method.GET,
      {},
    );
    const exampleAccount: AdminAccount = response.admins[0];
    console.log("exampleAccount", exampleAccount);

    return {
      id: "account-a",
      name: "Account A",
    };
  }

  public fetchDevices(): Device[] {
    return [
      {
        id: "device-a",
        manufacturer: "Manufacturer A",
        ownerId: "user-a",
      },
      {
        id: "device-b",
        manufacturer: "Manufacturer B",
        ownerId: "user-b",
      },
    ];
  }

  public fetchUsers(): User[] {
    return [
      {
        firstName: "User",
        id: "user-a",
        lastName: "A",
      },
      {
        firstName: "User",
        id: "user-b",
        lastName: "B",
      },
    ];
  }

  private async makeRequest<T>(
    url: string,
    method: Method,
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
      throw new Error("Couldn't get response!");
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

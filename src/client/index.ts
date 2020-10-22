import fetch, { RequestInit, Response } from 'node-fetch';

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import {
  AirWatchAdmin,
  AirWatchAdminsResponse,
  AirWatchClientConfig,
  AirWatchDevice,
  AirWatchDevicesResponse,
  AirWatchOrganizationGroup,
  AirWatchOrganizationGroupChild,
  AirWatchOrganizationGroupsResponse,
  HttpMethod,
  ResourceIteratee,
} from './types';

export function createAPIClient(config: AirWatchClientConfig): AirWatchClient {
  return new AirWatchClient(
    config.airwatchHost,
    config.airwatchUsername,
    config.airwatchPassword,
    config.airwatchApiKey,
  );
}

/**
 * API documentation is found at `https://<airwatch host>/api/help`.
 */
export default class AirWatchClient {
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

  public async verifyAuthentication(): Promise<void> {
    try {
      await this.makeRequest<AirWatchAdminsResponse>(
        `/system/admins/search?username=${encodeURIComponent(
          this.username,
        )}&pagesize=1`,
      );
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: err.endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateDevices(
    iteratee: ResourceIteratee<AirWatchDevice>,
  ): Promise<void> {
    let page = 0;
    let response: AirWatchDevicesResponse;
    do {
      response = await this.makeRequest<AirWatchDevicesResponse>(
        `/mdm/devices/search?page=${page++}`,
      );

      if (response) {
        for (const device of response?.Devices || []) {
          await iteratee(device);
        }
      }
    } while (response?.Devices?.length > 0);
  }

  public async iterateAdmins(
    iteratee: ResourceIteratee<AirWatchAdmin>,
  ): Promise<void> {
    let page = 0;
    let response: AirWatchAdminsResponse;
    do {
      response = await this.makeRequest<AirWatchAdminsResponse>(
        `/system/admins/search?page=${page++}`,
      );

      if (response) {
        for (const admin of response?.admins || []) {
          await iteratee(admin);
        }
      }
    } while (response?.admins?.length > 0);
  }

  public async iterateOrganizationGroups(
    iteratee: ResourceIteratee<AirWatchOrganizationGroup>,
  ): Promise<void> {
    let page = 0;
    let response: AirWatchOrganizationGroupsResponse;
    do {
      response = await this.makeRequest<AirWatchOrganizationGroupsResponse>(
        `/system/groups/search?page=${page++}`,
      );

      if (response) {
        for (const group of response?.OrganizationGroups || []) {
          const directChildren = await this.fetchOrganizationGroupDirectChildren(
            group.Id,
          );

          await iteratee({
            ...group,
            Children: directChildren,
          });
        }
      }
    } while (response?.OrganizationGroups?.length > 0);
  }

  /**
   * Answers the direct children of an Organization group.
   *
   * The API answers the complete heirarchy for a group. This returns only the
   * direct children, assuming the API will be called for each group since they
   * may not all be related.
   *
   * @param groupId the groupId to use when fetching children
   */
  public async fetchOrganizationGroupDirectChildren(
    groupId: number,
  ): Promise<AirWatchOrganizationGroupChild[]> {
    const response: AirWatchOrganizationGroupChild[] = await this.makeRequest(
      `/system/groups/${groupId}/children`,
    );
    return response.filter((g) => g.ParentLocationGroup.Id.Value === groupId);
  }

  private async makeRequest<T>(
    path: string,
    method: HttpMethod = HttpMethod.GET,
    headers: {} = {},
  ): Promise<T> {
    const url = `https://${this._host}/api${path}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json;version=2',
        Authorization: `Basic ${Buffer.from(
          this.username + ':' + this.password,
        ).toString('base64')}`,
        'aw-tenant-code': this.apiKey,
        ...headers,
      },
    };

    const response: Response | undefined = await fetch(url, options);

    if (!response) {
      throw new Error(`No response from '${url}'`);
    }

    if (response.status.toString().startsWith('2')) {
      const responseBody: string = await response.text();
      return responseBody.length > 0 ? JSON.parse(responseBody) : {};
    } else {
      throw new IntegrationProviderAPIError({
        endpoint: url,
        status: response.status,
        statusText: response.statusText,
      });
    }
  }
}

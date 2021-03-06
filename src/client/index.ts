import fetch from 'node-fetch';

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
  private readonly apiKey: string;
  private readonly authorization: string;

  constructor(
    host: string,
    username: string,
    password: string,
    apiKey: string,
  ) {
    this._host = host;
    this.username = username;
    this.apiKey = apiKey;

    const encodedAuth = Buffer.from(`${username}:${password}`).toString(
      'base64',
    );
    this.authorization = `Basic ${encodedAuth}`;
  }

  public get host(): string {
    return this._host;
  }

  public async verifyAuthentication(): Promise<void> {
    await this.makeRequest<AirWatchAdminsResponse>(
      `/system/admins/search?username=${encodeURIComponent(this.username)}`,
    );
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

      for (const device of response.Devices) {
        await iteratee(device);
      }
    } while (response.Devices.length < response.Total);
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

      for (const admin of response.admins) {
        await iteratee(admin);
      }
    } while (response.admins.length < response.Total);
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

      for (const group of response.OrganizationGroups) {
        const directChildren = await this.fetchOrganizationGroupDirectChildren(
          group.Id,
        );

        await iteratee({
          ...group,
          Children: directChildren,
        });
      }
    } while (response.OrganizationGroups.length < response.TotalResults);
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

  private async makeRequest<T>(path: string): Promise<T> {
    const url = `https://${this._host}/API${path}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.authorization,
        'aw-tenant-code': this.apiKey,
        Accept: 'application/json;version=2',
      },
    });

    const body = await response.text();
    const bodyJson = body.length > 0 && JSON.parse(body);

    if (response.status >= 200 && response.status < 300) {
      return bodyJson || {};
    } else {
      let cause: Error | undefined = undefined;
      if (bodyJson?.errorCode) {
        cause = new Error(`${bodyJson.message} (${bodyJson.errorCode})`);
      }

      if (response.status === 401) {
        throw new IntegrationProviderAuthenticationError({
          cause,
          endpoint: url,
          status: response.status,
          statusText: response.statusText,
        });
      } else {
        throw new IntegrationProviderAPIError({
          cause,
          endpoint: url,
          status: response.status,
          statusText: response.statusText,
        });
      }
    }
  }
}

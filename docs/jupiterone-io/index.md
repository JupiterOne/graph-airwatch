# Airwatch

## Overview

The integration connects directly to Airwatch APIs to obtain account
metadata and analyze resource relationships. Customers authorize access by
creating API credentials in their Airwatch account and providing those
credentials when setting up an instance of the integration in JupiterOne.

## API Authentication

Airwatch provides [detailed instructions on creating an API
credentials](https://resources.workspaceone.com/view/zv5cgwjrcv972rd6fmml/en). (Page: 32/1240).

## Entities

These entities are ingested when the integration runs:

| Example Entity Resource | \_type : \_class of the Entity        |
| ----------------------- | ------------------------------------- |
| Account                 | `airwatch_account`    : `Account`           |
| Admin                   | `airwatch_user`       : `Admin`             |
| OrganizationGroup       | `airwatch_user_group` : `OrganizationGroup` |
| Device                  | `airwatch_device`     : `Device`            |
| User                    | `endpoint_user`       : `User`              |

## Relationships

These relationships are created/mapped:

| From                  | Type        | To                    |
| --------------------- | ----------- | --------------------- |
| `airwatch_account`    | **HAS**     | `airwatch_user_group` |
| `airwatch_account`    | **MANAGES** | `airwatch_device`     |
| `airwatch_user_group` | **HAS**     | `airwatch_user`       |
| `airwatch_device`     | **HAS**     | `endpoint_user`       |

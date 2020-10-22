# Integration with JupiterOne

## Setup

After logging into VMWare AirWatch (Workspace ONE™️ UEM), create an
Administrator user account for the integration to authenticate with the REST
API.

1. Select **Accounts** > **Administrators** > **List View**.

2. Press the **Add** > **Add Admin**" button and provide required details. It is
   _recommended_ that you set values representing JupiterOne as a system user
   account. It is _important_ that you set _Title_ on the _Details_ tab to
   "system" so that JupiterOne understands this is a user for automation (it
   will not attempt to map to a Person entity).

3. Once the account is created, navigate to **Groups & Settings** > **All
   Settings** > **System** > **Advanced** > **API** > **REST API**" and click
   **Add** to create a new API key.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/master/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources          | Entity `_type`     | Entity `_class`      |
| ------------------ | ------------------ | -------------------- |
| Account            | `airwatch_account` | `Account`            |
| Admin              | `airwatch_user`    | `User`               |
| Device             | `user_endpoint`    | `Host`, `Device`     |
| Device User        | `device_user`      | `User`               |
| Organization Group | `airwatch_group`   | `Group`, `UserGroup` |

### Relationships

The following relationships are created/mapped:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `airwatch_account`    | **HAS**               | `airwatch_group`      |
| `airwatch_account`    | **MANAGES**           | `user_endpoint`       |
| `airwatch_group`      | **HAS**               | `airwatch_group`      |
| `airwatch_group`      | **HAS**               | `airwatch_user`       |
| `user_endpoint`       | **HAS**               | `device_user`         |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->

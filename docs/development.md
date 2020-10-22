# Development

Add details here to give a brief overview of how to work with the provider APIs.
Please reference any SDKs or API docs used to help build the integration here.

## Prerequisites

Supply details about software or tooling (like maybe Docker or Terraform) that
is needed for development here.

Please supply references to documentation that details how to install those
dependencies here.

Tools like Node.js and NPM are already covered in the [README](../README.md) so
don't bother documenting that here.

## Provider account setup

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

Configure the `.env` file to contain:

```
AIRWATCH_HOST='<your>.awmdm.com'
AIRWATCH_USERNAME='<username>'
AIRWATCH_PASSWORD='<password>'
AIRWATCH_API_KEY='<api key>'
```

## Authentication

Supply details here for information on how to authenticate with a provider so
that developers have an idea of what's needed to hit APIs. It may be useful to
provide explanations for each value specified in
[../src/instanceConfigFields.json](../src/instanceConfigFields.json).

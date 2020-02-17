# Authentication

Visit
[AirWatch Authentication Requirements](https://docs.vmware.com/en/VMware-Workspace-ONE-UEM/9.7/vmware-airwatch-guides-97/GUID-AW97-WS1Int_Auto_EnterAuthCreds.html)
to learn more about authentication requirements.

In order to connect with JupiterOne you need to perform the following steps:

1. Create an admin user account by selecting "**Accounts**" and then
   "**Administrators > List View**" in the dashboard.

2. Next, by pressing "**Add > Add Admin**" button you'll be asked several
   questions regarding the account you're about to create. It is important that
   you set user's title to "_system_".

3. Once the account is created, navigate to "**Groups & Settings > All
   Settings > System > Advanced > API > REST API**" and click "**Add**" to
   create a new API key.

4. Give it a name and you'll receive the newly generated API key.

You need to send the following information for the integration to work:

1. The admin account's email (_AIRWATCH_LOCAL_EXECUTION_USERNAME_)
2. The admin account's password (_AIRWATCH_LOCAL_EXECUTION_PASSWORD_)
3. The API key that you generated (_AIRWATCH_LOCAL_EXECUTION_API_TOKEN_)

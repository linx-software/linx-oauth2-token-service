# OAuth 2.0 token generator

## Overview

When connecting to numerous of the 3rd-Party systems out there via REST API, authentication is typically done via the OAuth 2.0 flow. This involves a user authorizing a connected application to access protected resources. After this, the server-side application generates and stores access tokens in a datasource which are then retrieved and used when submitting HTTP requests in order to authenticate them.

### Token generation service:
This sample Linx Solution can be used to automatically:

- intiate the OAuth 2.0 flow between a Linx application cloud server (or local PC) and an authorization server
- recieve the authentication code response
- exchange the authorizaion code for access tokens
- store the access tokens
- retrieve and use the access tokens in requests
- revoke access
- refresh access tokens


### Monitoring Dashboard:

A [monitoring dashboard](index.html) has been built using HTML, CSS and the Bootstrap framework to provide an overall view of your connected applications as well as manage the authorization/revoking of access tokens. This dashboard connects to the Linx web service which can run locally or in the cloud. The dashboard acts as an interface between a user and the Linx Solution allowing an overall status view of your conections as well as offering the ability to trigger different stages of the OAuth 2.0 flow for specific 3rd-party platforms.

With the dashboard, you are able to:
- Monitor the status of all your connections
    - Status
    - Details of connected entity
    - Expiry details of token
- Initiate the authorization flow
- Revoke access tokens
- Copy access tokens



The following 3rd-party platforms have already been setup with the Solution (you still need to add your app identifiers):

- [GitHub](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Microsot Graph](https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0&preserve-view=true)
- [Salesforce](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_curl.htm)
- [Google]()
- [Xero API]()


## Additional resources:

[![](https://img.shields.io/badge/Desktop_IDE-DOWNLOAD-download?style=flat&logoColor=white&logo=windows)](https://linx.software/get-started-today/)

[![](https://img.shields.io/badge/OAuth_2.0-Framework-informational?style=flat&logoColor=white&logo=auth0)](https://oauth.net/2/)

[![](https://img.shields.io/badge/Community-Connecting_to_MySQL_with_Linx-informational?style=flat&logoColor=white&logo=discourse&color=2bbc8a)](https://community.linx.software/community/t/quick-mysql-setup-and-test-on-linx/340/6?utm=gh)

[![](https://img.shields.io/badge/Community-Linx_REST_API_overview-informational?style=flat&logoColor=white&logo=discourse&color=2bbc8a)](https://community.linx.software/community/t/resthost-guide-overview/458?utm=gh)

---

## Dependencies

### Pre-requisites

[![](https://img.shields.io/badge/Linx_Designer-+v5.21.0.0-download?style=flat&logoColor=white&logo=windows)](https://linx.software/get-started-today/)

[![](https://img.shields.io/badge/MySQL-Local_database-informational?style=flat&logoColor=white&logo=mysql)](https://www.mysql.com/)


### Database

The sample Solution utilizes a MqSQL database instance as a datasource to store and retrieve the neccessary access tokens.

Run the [CREATE DATABASE script](mysql-setup-script.sql) on your local MySQL instance and configure the connection details as $.Settings in the sample Linx Solution.

---

## How it works?

The Linx Solution contains a REST web service which, when deployed (or debugged locally), acts as an interface between the **resource owner** (user), **Linx Server** and a **3rd-Party authentication server**.

The web service contains the below operations:


The REST web service contains a number of generic operations which cater for all the 3rd-Party systems. When the connection flow is intiated, the systems all use the same operations. This is achieved by strucuturing the API based on the 3rd-Party system name as a path paramater.

To demonstrate:


The process is as follows:
1. The Linx REST web service is deployed and started (or debugged locally).
2. A request is made to the endpoint `/{system name}`



---

## Registering a connected application

1. Register a new connected/oauth application on the chosen platform (GitHub, Facebook etc).
1. Configure the **callback/redirect URL**.

    Running locally:

        Redirect URL: http://localhost:8080/oauthy/{system name}/oauth/token


    Hosted on a Linx Cloud Server

        Redirect URL: https://api.{your instance name}/oauthy/{system name}/oauth/token

1. Save your registered app and generate a new `client secret`.
1. Copy your client identifiers (`client id` and `client secret`).



---

## Setting up the sample


Configure the $.Settings of the Linx Solution with your app identifiers:
1. Open the [provided sample](/Solution.lsoz) (`.lsoz`) in your Linx Designer.
2. Configure the Solution's `$.Settings` with the client identifiers generated from the step above. So for example, if you are dealing with 'GitHub' add the `client id` and `client secret` to the $.Settings values of `$.Settings.GitHubClientId` and `$.Settings.GitHubClientSecret`.

Configure the $.Settings of the Linx Solution with the following details:
ServerHost: If running locally you can leave as is
isLocalDevelopment: If running locally you can leave as is

| Setting name | Description | local env | cloud ev 
| --- | --- | --- | ---
|LinxIsLocalDevEnv | Indicates if you are running the Solution locally or not | True | False |
|LinxServerHostname | If you are hosting on a Linx Cloud server, add your instance here, so for example if my server is `https://demo.linx.twenty57.net` then my instance name is "demo". | localhost | {instance name}


---

## Using the sample

The Solution is configured to automatically alter connection properties based on the `$.Settings.LinxIsLocalDevEnv` value.

If you have followed the above steps then no more configuration is needed and you can follow the below instructions to generate your access tokens:


1. Deploy and active the Linx Solution:
    

    **Locally**

    1. In your Linx Designer, initialize the debugger on the REST web service.
    2. Once the debugger has been initizled, start the debugger.
    

    **Cloud**
    1. Deploy your Solution to your Linx application server.
    2. Start the Solution.
    3. Locate the REST web service and 'start' it.

3. Once the service is active, open the [monitoring dashboard](/index.html)
4. Configure the server connection details (*You can skip this leave as is if you havent altered the setup environment*)
5. Click on the 'Ping connection' icon to test the connection out, a result message will be displayed.
6. If connection is successful, a list of the available 3rd-party systems and the authentication status will be displayed.
7. To generate access tokens for your chosen 3rd-party system, select it the 3rd party system in the dashboard and hover over the **key** icon and you will see the 'Authorize' option appear.
8. Click the **key** icon.
9. A new tab will open, redirecting you to the chosen service provider's login page.
4. Once logged in, grant the connected Linx application permission to access your account's resources.
5. A redirection request will be made by the platform's authorization server to the Linx web service redirect url `{system name}/oauth/token` with an authorization code.
6. Linx then makes a request back to the authorization server submitting client credentials and the authorization code.
7. The generated token is then stored in the configured database.
8. An authorization summary containing details of the connected entity are returned and displayed to the user.
9. If you then refresh your dashboard or wait, the results of the connection will be displayed.

---

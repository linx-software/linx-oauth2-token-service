# OAuth 2.0 Token Authentication Service

## Description

Server-side authentication service to manage the secure generation, storage and retrieval of access tokens. 

- Create API Keys
- Link API Keys to access tokens.
- Intiate the OAuth 2.0 authorization flow and generate access tokens.
- Encrypt and store access tokens.
- Externally retrieve access token for external request usage.


The following 3rd-party service providers have already been setup with the Linx Solution:

- [GitHub](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Microsot Graph](https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0&preserve-view=true)
- [Salesforce](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_curl.htm)
- [Google]()

---

## System architecture

The Linx Solution contains a REST web service which acts as an interface between the **resource owner** (user), **Linx Server** and a 3rd-Party service provider's **authentication server**.

![System architecture](/img/system-architecture-main.png)


The system design consists of 4 separate REST web services hosted on a single server. There is a public facing API that acts as the intermediary between a user and the separate sub-services which persist data in isolated environments.

Each of these sub-services have been designed to handle separate related functionality. This was done so for both maintenance and security.

The idea here is that these sub-services can be further isolated and deployed to different servers, limiting the risk of complete breach. By separating the encryption keys and api keys, this adds a further layer of security, even though any encryption uses runtime values that only the user possesses.

The ‘Public API’ is responsible for retrieving the different credentials from the separate data persistence layers and using this to decrypt the relevant tokens. 

By ‘isolating’ the services into functional groups and separating data persistence layer, these services can be maintained and extended with much more ease as well as allowing greater control in terms of access restriction on the ‘Public API’ layer.




---

## Installation

The below steps decscribe how to host this Solution on your own Linx cloud server environment.

### Linx installation
1. Register for a Linx Designer license and download [here](https://linx.software/get-started-and-download-linx-a-low-code-platform-for-developers/).
2. Install the Linx Designer.
2. Register for a Linx cloud server [here](https://linx.software/server-buy2/). *If you require a database instance to use, register for a MySQL cloud database with your Linx cloud server.

### Database setup
The Solution uses a MySQL database to store user related credentials.
1. Run the provided setup script on your database instance.
3. Update the below Setting values in the Linx Solution:
- DatabasePassword: Password for your db instance
- DatabaseServer: If you are hosting on a Linx Cloud server, add your database instance name here, so for example `dev1db.linx.twenty57.net`.



### Solution deployment

1. Deploy the sample Solution to your server instance.
3. Open the Solution's Settings and update the 'LinxServerHostname' value to your server instance name -  If you are hosting on a Linx Cloud server, add your instance here.

   For example, if my server is `https://dev1.linx.twenty57.net` then my instance name is "dev1".
 3. On the Solutions services page, __start__ all of the services in the Solution.   

### Register a new app with the Servive provider

1. Login in to the chosen service providers developer console.
2. Register a new connected/oauth application.
3. Provide a 'Redirect' or 'Callback' url which is used to return the authorization code.
   
   To get this value without manually typing it out, make a request to the [CallbackURL operation](https://demo.api.linx.twenty57.net/linxauth/swagger/index.html?url=/linxauth/documentation/openapi.json#/OAuth%202.0%20flow/CallbackUrl).

   This will return a string built up of the callback url that you can then add to your app registration:
   ```
   https://dev1.api.linx.twenty57.net/linxauth/callback
   ```

   Add this string as the 'redirect url' in your app registration.
5. Add the selected scopes.
4. Save your app.
1. Copy the Client Id and Client Secret (generate a new one) values.

### Update Linx Solution's config

The Linx Solution is configured to use service provider's connection details which are stored as json objects on the server drive. When adding a new app configuration i.e. Google, GitHub, Microsoft, you will need to create the neccessary config file.  

1. Navigate to the __Config__ Project (Left menu > Projects > Config).
2. Locate the function specific to your service provider, i.e. the function _WriteConfigFileGithub_ is configured specifically for writing out the connection details for the GitHub API. 
3. Click __Run__, you will need to fill in the input parameters such as the _ClientId_ and _ClientSecret_ and other variable values such as the _Scopes_ if they differ from the default Solution. 
4. After filling in the fields, __run__ the function.

The service providers new connection information will be updated and written to a file on the server. 

The setup is now complete 🚀

---

## Managing users and API Keys

Once deployed, this service can be used by you an others from a number of different external systems. Listed below are the usage steps involved in using the sample on your cloud instance with:
- Postman
- Linx Designer 

### Using with Postman

A Postman collection has been created to automate the usage and testing of the authentication service. The collection contains pre-configured requests with scripts will will store the relevant values returned from the Linx Server.

[![Made with Postman](https://img.shields.io/badge/Postman_tests-white?style=flat-square&logo=postman&color=EF5B25&labelColor=white)](/tests/postman-collection/linx-auth-request-collection.json)


 1. __Configure Postman collection__: Open the provided Postman request collection and edit the collection variables to reflect your server details. The default 'admin' user credentials already exist.
1. __Register as a new user__: Execute the __RegisterUser__ request from the collection. Provide a password of your choosing in the `newPassword` field of the request body (default is "admin"). This will be the password used for future token adminstration operations. 
   
 
2. __Register a new API key__: Execute the __RegisterApiKey__ request from the collection. Provide a name for your API key in the requestBody.
  
3. __Initiate the OAuth 2.0 flow__: To initate the the authorization process and recieve the authorization url. Execute the __InitiateFlow__ request from the collection. Add your chosen service provider as the `system` parameter.
4. __Authorize the Linx app__: Copy the response from the previous request and navigate to the url in a browser. You will be prompted to authorize the Linx authentication service access.
  
5. __Token generation__: The Linx Service will recieve the callback request and exchange tha authorization code for an access token. The access token is then encrypted with your API Key and stored in the database. The unencrypted access token will be returned in the response. 
  
5. __Token retrieval__: To retrieve an access token for use when making request to the service provider's API, execute the __FetchToken__ request in the Postman collection. Edit the `system` query parameter to your chosen service provider and execute the request.
      
   A string containing the decrypted access token is then returned.

---

### Usage with Linx


A Linx Solution has been developed to automate the usage and testing of the authentication service. This is a very basic solution which does not store your API Key automatically. You will therefore need to follow the below manual steps to register as a user and generate access tokens.

[![Linx Automated Tests](https://img.shields.io/badge/-Automated_tests-gray.svg?style=flat-square&labelColor=2EB398&color=white&logo=data:image/svg%2bxml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjIsIFNWRyBFeHBvcnQgUGx1Zy1JbiAgLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiIFsNCgk8IUVOVElUWSBuc19mbG93cyAiaHR0cDovL25zLmFkb2JlLmNvbS9GbG93cy8xLjAvIj4NCl0+DQo8c3ZnIHZlcnNpb249IjEuMSINCgkgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6YT0iaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZVNWR1ZpZXdlckV4dGVuc2lvbnMvMy4wLyINCgkgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIxNTBweCIgaGVpZ2h0PSIxNTBweCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE1MCAxNTAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGRlZnM+DQo8L2RlZnM+DQo8cmVjdCBmaWxsPSIjMkVCMzk4IiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIvPg0KPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTY2LjE0NywxMDYuMDM4aDYzLjIxN3YyNi41NDhINjYuMTQ3Yy0zMi44NywwLTQ1LjUxMi0xMy42OTctNDUuNTEyLTQxLjA4OVYxNy40MTRoMzIuODd2NzQuMDgzDQoJQzUzLjUwNiw5Ni4yMTgsNTYuMDU1LDEwNi4wMzgsNjYuMTQ3LDEwNi4wMzh6Ii8+DQo8cGF0aCBvcGFjaXR5PSIwLjMiIGZpbGw9IiM0RDRENEQiIGQ9Ik02Ni4xNDcsMTA2LjAzOGMtMTAuMDkzLDAtMTIuNjQyLTkuODItMTIuNjQyLTE0LjU0MXYtMC4yNzgNCgljMCwyOS4zODItMS45MTcsNDEuMzY3LDExLjE4Niw0MS4zNjdoNjQuNjczdi0yNi41NDhINjYuMTQ3eiIvPg0KPC9zdmc+DQo=)](/tests/linx-automated-testing/)


1. Open up the Linx 'automated testing' Solution in your Linx Designer.
2. Update solution settings: Update the Solution's setting 'LinxServerHostname' to be the name of your Linx instance. So for example, if my Linx cloud server instance is `https://dev1.linx.twenty57.net/` , then the my instance name is "dev1".
3. Register a new API key: Debug the _RegisterApiKey_ function. When the function completes, the Debug Output will display a result like below:
   ```
   Function started.
   Function result:
   {
   "ApiKeyData": {
      "name": "Test Key",
      "expires": "2021-10-20 10:43:41.0000000",
      "apiKey": "YSh+j4osdkgISHXNSJxh5MqYfMUSJiT7XSeU+xoeA="
   }
   }
   Function finished.

   ```
   Copy the 'apiKey' value from the debug output.

   Open the Solution's Settings and past the copied value into the'ApiKey' setting value.
3. Initate the OAuth flow: Open the _TestInitiateFlow_ function in your Linx Designer and Add a Breakpoint (Right click - Add breakpoint) to the InitateFlow function call. Next, debug the _TestInitiateFlow_ function and STEP OVER the InitateFlow function call. Copy the value from the Debug Values panel and navigate to it in a browser.
4. After successful authorization, go back to the Linx Designer and debug the TestFetchToken function, adding a breakpoint and stepping over the FetchToken function call like before.
5. Copy the value of the access token returned from the function call.
6. To test your access token, debug the TestAccessTokenGithub function, pasting the access token in the input parameter.
7. You should see the details of the authenticated user being returned from the HTTP request.

## Customizing
This sample has been built to handle the OAuth 2.0 authorization flow as generically as possible, however, slight differences occur in the implementation by the different service providers. 

In some cases, adding a new service provider is as easy as running the generic config file writing function and providing it with the correct api connection info. In others, certain nuances in require additional investigation and development.

If you would like to see a specific service provider added to the sample, create an issue in this repo or send your request to support@linx.software.


## License

[MIT](https://github.com/linx-software/template-repo/blob/main/LICENSE.txt)
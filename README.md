# linx-oauth2-authentication-service

## Description

Server-side [Linx](https://linx.software/) application to manage the secure generation, storage and retrieval of access tokens. 

Features:
- Create mulitple user profiles
- Generate API Keys
- Link API Keys to access tokens
- Initiate the [OAuth 2.0 authorization code grant flow](https://oauth.net/2/grant-types/authorization-code/) and generate access tokens.
- Encrypt and store access tokens.
- Retrieve access token for external request usage.


The following 3rd-party service providers have already been setup with the Linx Solution:

- Github
- Microsoft Graph
- Salesforce
- Google

### Background and motivation
When building integrations or apps which interact with external service providers such as Google, [Github](https://github.com/linx-software/github-api-connectors) or [Microsoft](https://github.com/linx-software/ms-graph) via REST API, apps require 'access tokens' to authenticate requests made to the service providers API.

Setting up this authorization process can become frustrating and hinder your progress with integrations especially when you want to get started on building out your concepts. Furthermore, when developing integrations in teams, many of the resource access needs to be shared which becomes difficult with manual user authorization.

The aim of this project is to create a shared service that handles the generation and storage of access tokens for the multiple systems that I integrate with on a day-to-day basis in my work with Linx.  

---

### System architecture

The Linx Solution contains a REST web service which acts as an interface between the **resource owner** (user), **Linx Server** and a 3rd-Party service provider's **authentication server**.

![System architecture](/img/system-architecture-main.png)


The system design consists of 4 separate REST web services hosted on a single Linx cloud server. There is a public facing API that acts as the intermediary between a user and the separate sub-services which persist data in a cloud database.

Each of these sub-services have been designed to handle separate related functionality. This was done so for both maintenance and security.

The idea here is that these sub-services can be further isolated and deployed to different servers, limiting the risk of complete breach. By separating the encryption keys and API keys, this adds a further layer of security, even though any encryption uses runtime values that only the user possesses.

The ‘Public API’ is responsible for retrieving the different credentials from the separate data persistence layers and using this to decrypt the relevant tokens. 

By isolating the services into functional groups and separating data persistence layers, these services can be maintained and extended with much more ease. The isolation provides added control in terms of restricting access from the external world by buffering the systems with the ‘Public API’ layer.

For more technical details of the service architecture and design, take a look at the [wiki]().


---

## Installation

The below steps describe how to host this Solution on your own Linx cloud server environment.

### Install Linx
1. Register for a Linx Designer license and download [here](https://linx.software/get-started-and-download-linx-a-low-code-platform-for-developers/).
2. Install the Linx Designer.
2. Register for a trial Linx cloud server and MySQL cloud database [here](https://linx.software/server-buy2/).


### Run database setup scripts
The Solution uses a MySQL database to store user related credentials.
1. Run the provided setup script on your database instance.
3. Update the below Setting values in the Linx Solution:
   - `DatabasePassword`: Password for your db instance
   - `DatabaseServer`: If you are hosting on a Linx Cloud server, add your database instance name here, so for example `dev1db.linx.twenty57.net`.


### Deploy to your cloud server

1. Log into your cloud server instance and upload the Solution.
3. Open the Solution's Settings and update the `LinxServerHostname` value to reflect your server instance name -  If you are hosting on a Linx Cloud server, add your instance here.

   For example, if my server is `https://dev1.linx.twenty57.net` then my instance name is "dev1".
 3. On the services page, __start__ all of the services in the Solution.   


### Register an app and client identifiers

Client identifiers need to be configured between the service provider and the Linx Solution. 

Register a new app with service provider and generate the neccessary client identifiers.

For more technical details of the registration process and the different service providers and their nuances, take a look at the [wiki]().


### Update the Linx Solution's config

The Linx Solution is configured to use service provider's connection details which are stored as JSON objects in files on the server drive. When adding a new app configuration i.e. Google, GitHub, Microsoft, you will need to create the necessary config file with your unique client identifiers.

1. From the server dashboard, navigate to the __Config__ Project (Left menu > Projects > Config).
2. Locate the function specific to your service provider, i.e. the function _WriteConfigFileGithub_ is configured specifically for writing out the connection details for the Github API. 
3. Click  __Run Function__
4. Complete the missing input parameters:
   - _ClientId_ 
   - _ClientSecret_ 
   - _ClientScopes_: If the chosen scopes differ from the default Solution then update this value. *These scopes will need to be entered in the specified format specified in the service provider's documentation*.
4. Click __RUN FUNCTION__.

The service providers new connection information will be written to a file on the server drive. 

The setup is now complete 🚀

---

## Managing users, API Keys & access tokens

Once deployed, this service can be used by you an others from a number of different external systems to retrieve access tokens for external requests.

Listed below are the usage steps involved in using the deployed service from 2 request platforms:
- Postman - download it [here](https://www.postman.com/downloads/).
- Linx Designer - download it [here](https://linx.software/get-started-and-download-linx-a-low-code-platform-for-developers/)

For more technical details of the different operations involved, take a look at the [wiki]().


### Using with Postman

A [Postman collection](/tests/postman-collection/linx-auth-request-collection.json) has been created to automate the usage and testing of the authentication service. The collection contains pre-configured requests with scripts will will store the relevant values returned from the Linx Server.




 1. Configure Postman collection: Open the provided [Postman collection](/tests/postman-collection/linx-auth-request-collection.json) and edit the collection variables to reflect your server details. The default 'admin' user credentials are already completed for you.
1. Register as a new user: Execute the __RegisterUser__ request from the collection. Provide a password of your choosing in the `newPassword` field of the request body (default is "admin"). This will be the password used for future token administration operations. 
   
 
2. Register a new API key: Execute the __RegisterApiKey__ request from the collection. Provide a name for your API key in the requestBody.

   A response containing the API Key will be returned as stored in the Postman collection variable.
  
3. Initiate the OAuth 2.0 flow: To initiate the the authorization process and receive the authorization url, execute the __InitiateFlow__ request from the collection. Add your chosen service provider as the `system` query parameter.
4. Authorize the Linx app: Copy the response from the previous request and navigate to the URL in a browser. You will be prompted to authorize the Linx authentication service access to your identity.
  
5. Token generation: The Linx Service will receive the callback request and exchange the authorization code for an access token. The access token is then encrypted with your API Key and stored in the database. 
  
5. Token retrieval: To retrieve an access token for use when making request to the service provider's API, execute the __FetchToken__ request in the Postman collection. Edit the `system` query parameter to your chosen service provider and execute the request.
      
   A string containing the decrypted access token is then returned in the response.

---

### Using with the Linx Designer


A Linx Solution has been developed to automate the usage and testing of the authentication service. This is a very basic solution which does not store your API Key automatically. You will therefore need to follow the below manual steps to register as a user and generate access tokens.


1. Open up the [automated testing Solution](/tests/linx-automated-testing/) in your Linx Designer.
2. Edit the Solution's setting `LinxServerHostname` to be the name of your Linx instance. So for example, if my Linx cloud server instance is `https://dev1.linx.twenty57.net/` , then the my instance name is "dev1".
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
3. Initiate the OAuth flow: Open the _TestInitiateFlow_ function in your Linx Designer and add a _breakpoint_ (Right click > __Add Breakpoint__) to the InitateFlow function call. Next, debug the _TestInitiateFlow_ function and STEP OVER the InitateFlow function call. Copy the value from the Debug Values panel and navigate to it in a browser.
4. After successful authorization, go back to the Linx Designer and debug the TestFetchToken function, adding a breakpoint and stepping over the FetchToken function call like before.
5. Copy the value of the access token returned from the function call.
6. To test your access token, debug the TestAccessTokenGithub function, pasting the access token in the input parameter.
7. You should see the details of the authenticated user being returned from the HTTP request.

---

## Customizing
This sample has been built to handle the OAuth 2.0 authorization flow as generically as possible, however, slight differences occur in the implementation by the different service providers. 

In some cases, adding a new service provider is as easy as running the generic config file writing function and providing it with the correct API connection info. In others, certain nuances in require additional investigation and development.

If you would like to see a specific service provider added to the sample, create an issue in this repo or send your request to support@linx.software.

---
## Missing pieces and roadmap

A limitation of the current design is that only 1 access token per service provider can exist per API Key. Adding a feature to have multiple access tokens for a service linked to a single API Key would be useful.

Currently, all the interaction with the service is achieved using a request platform like Linx or Postman which requires you to manually execute the required steps. The plan for this project is to hopefully implement a front-end with JavaScript or React which will allow you to more easily manage tokens from a front-end portal, without having to set up web service calls to manage user registration and token generation etc.



---

## License

[MIT](https://github.com/linx-software/template-repo/blob/main/LICENSE.txt)
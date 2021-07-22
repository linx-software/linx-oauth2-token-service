# linx-oauth2-token-service

## Description

Server-side [Linx](https://linx.software/) application to manage the secure generation, storage and retrieval of access tokens. 

Features:
- Create multiple user profiles
- Generate API Keys
- Initiate the OAuth 2.0 authorization code grant flow
- Link API Keys to access tokens.
- Encrypt and store access tokens.
- Retrieve access token for external request usage.


The following 3rd-party service providers have already been setup with the Linx Solution:

- GitHub
- Microsoft Graph
- Salesforce
- Google


For more technical details of the service architecture, service providers and API specification, take a look at the [wiki](https://github.com/linx-software/linx-oauth2-token-service/wiki).

---

### Background and motivation
When building integrations using Linx, the majority of the integrations are achieved via HTTP requests to 3rd-party service providers such as Google, GitHub or Microsoft. These services require a user to grant an application permission to act on their behalf. 

This involves the [OAuth 2.0 authorization code grant flow](https://oauth.net/2/grant-types/authorization-code/) between a user, server-side app and the service provider’s authentication server. This flow results in 'access tokens' being generated which are used to authenticate requests made by the app to the service provider's API.

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

For more technical details of the service architecture and design, take a look at the [wiki](https://github.com/linx-software/linx-oauth2-token-service/wiki/System-architecture-and-design).


---

## Installation

The below steps describe how to host this Solution on your own Linx cloud server environment.

### Register for a Linx trial server
This solution runs on a Linx cloud server instance and integrates with a hosted MySQL database.

1. Register for a Linx trial cloud server and MySQL cloud database [here](https://linx.software/server-buy2/).
2. You will receive an email containing your Linx cloud server, drive space and MySQL database credentials when your trial server has been activated.

### Run database setup scripts
The Solution uses a MySQL database to store user related credentials.
1. Run the provided setup script on your database instance.
3. Update the below Setting values in the Linx Solution (these credentials can be found in your server registration email):
   - `DatabasePassword`: Password for your db instance
   - `DatabaseServer`: Your cloud database server name i.e. `dev1db.linx.twenty57.net`.


### Deploy to your cloud server

1. Log into your cloud server instance and upload the Solution (Top Menu > Server > Upload).
3. Open the Solution's Settings and update the `LinxServerHostname` value to reflect your server instance name -  for example, if my server is `https://dev1.linx.twenty57.net` then my instance name is "dev1".
4. Click __Save__.
3. On the Solution's service dashboard page, __start__ all of the services for the Solution.   


### Register an app and client identifiers

Client identifiers need to be configured between the service provider and the Linx Solution. You must register a new app with service provider and generate the neccessary client identifiers.

For more technical details of the registration process and the different service providers and their nuances, take a look at the [wiki](https://github.com/linx-software/linx-oauth2-token-service/wiki/3rd-party-service-provider-setup#service-providers).


### Update the Linx Solution's config

The Linx Solution is configured to use service provider's connection details which are stored as JSON objects in files on the server drive. When adding a new app configuration i.e. Google, GitHub, Microsoft, you will need to create the necessary config file with your unique client identifiers.

For more technical details of the configuration process, take a look at the [wiki](https://github.com/linx-software/linx-oauth2-token-service/wiki/3rd-party-service-provider-setup#server-configuration).


---

## Managing users, API Keys & access tokens

Once deployed, this service can be used by you an others from a number of different external systems to retrieve access tokens for external requests.

Listed below are the usage steps involved in using the deployed service from 2 request platforms:
- Postman - download it [here](https://www.postman.com/downloads/).
- Linx Designer - download it [here](https://linx.software/get-started-and-download-linx-a-low-code-platform-for-developers/)

For more technical details of the different operations involved and the API spec, take a look at the [wiki](https://github.com/linx-software/linx-oauth2-token-service/wiki/API-specification).

### Generating tokens with Postman

A [Postman collection](/tests/postman-collection/) has been created to automate the usage and testing of the authentication service. The collection contains pre-configured requests with scripts will will store the relevant values returned from the Linx Server.

The collection is configured to use a default service provider which is stored in the collection variables. The intial value of this is for GitHub authorization. 


 1. __Configure Postman collection__:     Open Postman and import the provided [request collection](/tests/postman-collection/) in Postman.
    
    Edit the _Linx OAuth 2.0 authentication service_ Postman collection's variable `linx_instance_name` to reflect your server instance name - for example, if my server is `https://dev1.linx.twenty57.net` then my instance name is "dev1".
    
    __Save__ the collection variables.
1. __Register as a new user__:    Execute the __RegisterUser__ request from the collection. 
   
   Provide a password of your choosing in the `newPassword` field of the request body (default is "admin"). This will be the password used for future token administration operations. 
   
 
2. __Register a new API key__:   Execute the __RegisterApiKey__ request from the collection.
   
   A response containing the API Key will be returned as stored in the Postman collection variable.
  
3. __Initiate the OAuth 2.0 flow__: To initiate the the authorization process and receive the authorization url, execute the __InitiateFlow__ request from the collection. 
   
   Add your chosen service provider as the `system` query parameter.
4. __Authorize the Linx app__: Copy the response from the previous request and navigate to the URL in a browser. 
   
   You will be prompted to authorize the Linx authentication service access to your identity.
  
5. __Token generation__: The Linx Service will receive the callback request and exchange the authorization code for an access token. 
   
   The access token is then encrypted with your API Key and stored in the database. 

   The raw access token is returned to the user in the browser.
  
5. __Token retrieval__: To retrieve an access token for use when making request to the service provider's API, execute the __FetchToken__ request in the Postman collection. 
   
   Edit the `system` query parameter to your chosen service provider and execute the request.
      
   A string containing the decrypted access token is then returned in the response.

---

### Generating tokens with the Linx Designer


A Linx Solution has been developed to automate the usage and testing of the authentication service. This is a very basic solution which does not store your API Key automatically. You will therefore need to follow the below manual steps to register as a user and generate access tokens.

The Solution is configured to use a default service provider which is stored in the Setting value. The intial value of this is for GitHub authorization. 

1. __Configure Linx Solution__:  Open up the [automated testing Solution](/tests/linx-automated-testing/) in your Linx Designer.

   Edit the Solution's setting value `LinxServerHostname` to be the name of your Linx instance. 
   
   So for example, if my Linx cloud server instance is `https://dev1.linx.twenty57.net/` , then the my instance name is "dev1".
3. __Register a new API key__:   Debug the _RegisterApiKey_ function. When the function completes, the Debug Output will display a result like below:

   ![Register API Key](/img/RegisterApiKey-linx-designer-view.png)

   Copy the 'apiKey' string value.

   Open the Solution's Settings and past the copied value into the'ApiKey' setting value and __save__ the Solution.
   ![Save API Key](/img/RegisterApiKey-save-key-linx-designer-view.png)
   
3. __Initiate the OAuth flow__: Open the _TestInitiateFlow_ function in your Linx Designer and add a _breakpoint_ (Right click > __Add Breakpoint__) to the InitateFlow function call. 
   
   Next, debug the _TestInitiateFlow_ function and STEP OVER the _InitateFlow_ function call. 
   
   Copy the value from the Debug Values panel and navigate to it in a browser.

   ![Initate flow](/img/InitateFlow-linx-designer-view.png)

4. __Authorize the Linx app__:  Copy the result from the previous function and navigate to the URL in a browser. 
   
   You will be prompted to authorize the Linx authentication service access to your identity.
  
   ![App authorization](/img/Authorize-github-view.png)

5. __Token generation__: 
   The Linx Service will receive the callback request and exchange the authorization code for an access token. 
   
   The access token is then encrypted with your API Key and stored in the database. 

   The raw access token is returned to the user in the browser.

   ![Token Generation](/img/GeneratedToken-github.png)

4. __Token retrieval__:    Go back to the Linx Designer and debug the _TestFetchToken_ function.  Copy the value of the access token returned from the function call.

   ![Token retrieval](/img/FetchToken-linx-designer-view.png)

6. __Testing the token__ : Debug the _TestAccessTokenGithub_ function. The access token is retrieved from the service and passed into the GetUser call which returns details of the authenticated user.

7. You should see the details of the authenticated user being returned from the HTTP request.

   ![Token retrieval](/img/AutomatedTest-github.png)

__Adding users:__

To create a new user, run the _CreateUser_ function from the server dashboard (Projects > UserAdminService > Functions > CreateUser). 

Add your new username and password as the input parameters. A user record will be created with the username and hashed password for future validation.

---

## Customizing
This sample has been built to handle the OAuth 2.0 authorization flow as generically as possible, however, slight differences occur in the implementation by the different service providers. 

In some cases, adding a new service provider is as easy as running the generic config file writing function and providing it with the correct API connection info. In others, certain nuances in require additional investigation and development.

If you would like to see a specific service provider added to the sample or have trouble with the existing sample, send your request to support@linx.software.

---
## Missing pieces and roadmap

A limitation of the current design is that only 1 access token per service provider can exist per API Key. Adding a feature to have multiple access tokens for a service linked to a single API Key would be useful.

Currently, all the interaction with the service is achieved using a request platform like Linx or Postman which requires you to manually execute the required steps. The plan for this project is to hopefully implement a front-end with JavaScript or React which will allow you to more easily manage tokens from a front-end portal, without having to set up web service calls to manage user registration and token generation etc.



---

## License

[MIT](https://github.com/linx-software/template-repo/blob/main/LICENSE.txt)

# OAuth 2.0 token generator

## Description

Service to manange the generation, storage and retrieval of access tokens generated via the OAuth 2.0 Authorization Code Grant Flow for 3rd-party service providers built using Linx.

- Intiate the OAuth 2.0 flow between a Linx application cloud server (or local PC) and an authorization server
- Recieve the authentication code response
- Exchange the authorizaion code for access tokens
- Encrypt and store access tokens
- Fetch access token for request authentication.


The following 3rd-party service providers have already been setup with the sample:

- [GitHub](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Microsot Graph](https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0&preserve-view=true)
- [Salesforce](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_curl.htm)
- [Google]()

---

## How it works?

The Linx Solution contains a REST web service which, when deployed (or debugged locally), acts as an interface between the **resource owner** (user), **Linx Server** and a **3rd-Party authentication server**.

The user/front facing REST service acts as an intermediary between the various independant Linx REST services acting as a security layer without exposing the other services to a user.

For more technical details, take a look at the wiki.

---

## Live Demo

A live version of this project is hosted on a Linx Application Cloud Server.

The official API documentation of the service is available [here](https://demo.api.linx.twenty57.net/linxauth/swagger).

A Postman collection has also been included in the repo to test and use the service.

To generate an access token as a new user:

  1. __Register as a new user__: Make a request to the `/users/register` endpoint, submitting your email address as the username, your unique Linx Designer License ID as the current password, and then submit a new password which will be used for authenticating users for token administration.
  
  2. __Register a new API key__: Register a new API Key which is used for encrypting access tokens and validating token generation and retrieval requests. Make a request to the `/keys/register` endpoint. This key is never stored and is only available when it is initially generated and sent to you.
  
  3. __Iniate the OAuth 2.0 flow__: Iniate the the authorization process which will result in a redirection to the chosen `system` authorization page. Intiate the authorization by making a request to the `/authorize` endpoint, submitting your API Key generated in _Step 2_ in the `Authorization` header. Include the service provider name i.e. "github","google" as the `system` parameter.
  
  4. __Authorize the Linx app__: Authorize the Linx Authentication Service on the service providers authorization portal.
  
  5. __Token generation__: The Linx Service will recieve the callback request and exchange tha authorization code for an access token. The access token is then encrypted with your API Key and stored in the database. The unencrypted access token will be returned in the response. 
  
  5. __Token retrieval__: The retrieve the access token at a later stage from an external system, make a request to the `/token` endpoint.
   
     Submit your API Key generated in _Step 2_ in the `Authorization` header. 
     
     Include the system i.e. "github","google" as a query parameter. 
     
     A string containing the decrypted access token is then returned.

---

## Installation

The below steps decscribe how to configure the sample to run on your own cloud server environment.

### Linx installation
1. Install Linx Designer and register for a Linx cloud server. 
2. If you do not have a database instance to use, register for a a MySQL cloud database with your Linx cloud server.

### Setup the database:
1. Run the provided setup script on your database instance.
3. Update the below Setting values in the Linx Solution:

    | Setting name | Description | Value
    | --- | --- | --- 
    |DatabasePassword | Password for your db instance | {your password} |
    |DatabaseServer | If you are hosting on a Linx Cloud server, add your database instance name here, so for example  `demodb.linx.twenty57.net`  | {db instance name}

A default 'admin' user is created with the password of 'root'.

### Deploy the Solution:

1. Deploy the sample Solution to your server instance.
3. Update the below Setting values in the Linx Solution:

    | Setting name | Description | Value
    | --- | --- | --- 
    |LinxIsLocalDevEnv | Indicates if you are running the Solution locally or not | False |
    |LinxServerHostname | If you are hosting on a Linx Cloud server, add your instance here, so for example if my server is `https://demo.linx.twenty57.net` then my instance name is "demo".  | {instance name}
    |LinxRootDrive | Root folder for file operations | f:/mydrive/token-gen/ |
    

### Register a connected application:

If hosting this as your own service, you will need to register an app on the various service providers sites and configure the Linx Solution with your app identifiers. 

Add the redirection URL:

When registering an application, you will be required to provide a 'Redirection' or 'Callback' url which is used to return the authorization code.

To get this value without manually typing it out, make a request to the [CallbackURL operation](https://demo.api.linx.twenty57.net/linxauth/swagger/index.html?url=/linxauth/documentation/openapi.json#/OAuth%202.0%20flow/CallbackUrl).

This will return a string built up of the callback url that you can then add to your app registration:
```
https://demo.api.linx.twenty57.net/linxauth/callback
```

Add this string as the 'redirect url' in your app registration.

Generate client identifiers:

1. Save your registered app, you will be presented with client identifiers (generate e a new `client secret` if you do not have one).
2. Copy the Client Id and Client Secret values.

### Generate config files:

The service is configured to use service providers connection details stored as json objects on the server drive. When adding a new app configuration i.e. Google, GitHub, Microsoft, you will need to create the neccessary config file.

1. Navigate to the 'Config' Project (Left menu > Projects > Config).
2. Locate the function specific to your service provider, i.e. the function 'WriteConfifFileGithub' is configured specifically for writing out the connection details for the GitHub API. 
3. Click __Run__, you will need to complete the missing fields such as the ClientId and ClientSecret. 
4. After filling in the fields, __run__ the function.

The service providers new connection information will be updated.


 ## Contributing

 If you would like to see a specific service provider added to the sample, contact support@linx.software.






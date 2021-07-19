# OAuth 2.0 token generator

## Description

Generic authentication service for the generation, storage and retrieval of access tokens generated via the OAuth 2.0 flow for 3rd-party service providers built using the low-code platform Linx.


- Intiate the OAuth 2.0 flow between a Linx application cloud server (or local PC) and an authorization server
- Recieve the authentication code response
- Exchange the authorizaion code for access tokens
- Encrypt and store access tokens
- Fetch access token for request authentication.


The following 3rd-party service providers have already been setup with the Linx Solution:

- [GitHub](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Microsot Graph](https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0&preserve-view=true)
- [Salesforce](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_curl.htm)
- [Google]()

---

## How it works?

The Linx Solution contains a REST web service which acts as an interface between the **resource owner** (user), **Linx Server** and a 3rd-Party service provider's **authentication server**.

Access tokens are encrypted/decrypted using the runtime values of a user's API key.



For more technical details, take a look at the [wiki](https://github.com/linx-software/oauth2-token-generator/wiki).

---

## Live Demo

This sample is deployed and hosted on a publicly accessible Linx cloud server. 

[![](https://img.shields.io/badge/API_reference-white?style=flat-square&logo=swagger&color=43CA61&labelColor=white&logoColor=43CA61)](https://demo.api.linx.twenty57.net/linxauth/swagger) [![Made withPostman](https://img.shields.io/badge/Postman_collection-white?style=flat-square&logo=postman&color=EF5B25&labelColor=white)](/tests/postman-collection/linx-auth-request-collection.json)

To use the Linx Authentication service:

1. __Register for a Linx developer license__: Register for a Linx Designer developer license [here](https://linx.software/get-started-and-download-linx-a-low-code-platform-for-developers/). Users are intially validated based on their unique Linx Designer license key and email. You will be sent an email containing your unique __license Id__ and download link.
1. __Configure Postman__: Open the provided Postman collection and edit the collections variables to reflect your email address and license id as the `user_username` and `user_password` body parameters. 
  
2. __Register as a new user__: Execute the __RegisterUser__ request from the collection. Provide a password of your choosing in the `newPassword` field of the request body (default is "admin"). This will be the password used for future token adminstration operations. 
   
 
2. __Register a new API key__: Execute the __RegisterApiKey__ request from the collection. Provide a name for your API key in the requestBody.
  
3. __Initiate the OAuth 2.0 flow__: To initate the the authorization process and recieve the authorization url. Execute the __InitiateFlow__ request from the collection. Add your chosen service provider as the `system` parameter.
4. __Authorize the Linx app__: Copy the response from the previous request and navigate to the url in a browser. You will be prompted to authorize the Linx authentication service access.
  
5. __Token generation__: The Linx Service will recieve the callback request and exchange tha authorization code for an access token. The access token is then encrypted with your API Key and stored in the database. The unencrypted access token will be returned in the response. 
  
5. __Token retrieval__: To retrieve an access token for use when making request to the service provider's API, execute the __FetchToken__ request in the Postman collection. Edit the `system` query parameter to your chosen service provider and execute the request.
      
   A string containing the decrypted access token is then returned.

---

## Installation

The below steps decscribe how to host this Solution on your own Linx cloud server environment.

### Linx installation
1. Register for a Linx Designer license and download [here](https://linx.software/get-started-and-download-linx-a-low-code-platform-for-developers/).
2. Install the Linx Designer.
2. Register for a Linx cloud server [here](https://linx.software/server-buy2/). *If you require a database instance to use, register for a MySQL cloud database with your Linx cloud server.

### Database setup

1. Run the provided setup script on your database instance.
3. Update the below Setting values in the Linx Solution:

    | Setting name | Description | Value
    | --- | --- | --- 
    |DatabasePassword | Password for your db instance | {your password} |
    |DatabaseServer | If you are hosting on a Linx Cloud server, add your database instance name here, so for example  `demodb.linx.twenty57.net`  | {db instance name}

A default 'admin' user is created with the password of 'root'.

### Solution deployment

1. Deploy the sample Solution to your server instance.
3. Update the below Setting values of the Solution on the server:

    | Setting name | Description | Value
    | --- | --- | --- 
    |LinxIsLocalDevEnv | Indicates if you are running the Solution locally or not | False |
    |LinxServerHostname | If you are hosting on a Linx Cloud server, add your instance here, so for example if my server is `https://demo.linx.twenty57.net` then my instance name is "demo".  | {instance name}
    |LinxRootDrive | Root folder for file operations | f:/mydrive/token-gen/ |
 3. On the Solutions services page, __start__ all of the services in the Solution.   

### Register a connected application

1. Login in to the chosen service providers developer console.
2. Register a new connected/oauth application.
3. Provide a 'Redirect' or 'Callback' url which is used to return the authorization code.
   
   To get this value without manually typing it out, make a request to the [CallbackURL operation](https://demo.api.linx.twenty57.net/linxauth/swagger/index.html?url=/linxauth/documentation/openapi.json#/OAuth%202.0%20flow/CallbackUrl).

   This will return a string built up of the callback url that you can then add to your app registration:
   ```
   https://demo.api.linx.twenty57.net/linxauth/callback
   ```

   Add this string as the 'redirect url' in your app registration.
5. Add the selected scopes.
4. Save your app.
1. Copy the Client Id and Client Secret (generate a new one) values.

### Update app identifiers

The service is configured to use service providers connection details stored as json objects on the server drive. When adding a new app configuration i.e. Google, GitHub, Microsoft, you will need to create the neccessary config file. 

1. Navigate to the __Config__ Project (Left menu > Projects > Config).
2. Locate the function specific to your service provider, i.e. the function _WriteConfigFileGithub_ is configured specifically for writing out the connection details for the GitHub API. 
3. Click __Run__, you will need to fill in the input parameters such as the _ClientId_ and _ClientSecret_ and other variable values such as the _Scopes_ if they differ from the default Solution. 
4. After filling in the fields, __run__ the function.

The service providers new connection information will be updated and written to a file on the server. 

The Solution setup is now complete.

 ## Contributing

 If you would like to see a specific service provider added to the sample, contact support@linx.software.






# OAuth 2.0 token generator

## Overview

The sample Linx Solution provides a generic structures which can be used to automatically:

- intiate the OAuth 2.0 flow between a Linx Server (or locally) and an authorization server
- recieve the authentication code response
- request access tokens
- store the access tokens
- retrieve and use the access tokens in requests

The following 3rd party platforms have already been configured within the Linx Solution.

- [GitHub API](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Microsot Graph API](https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0&preserve-view=true)
- [Salesforce API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_curl.htm)
- ***

### Additional resources

- [Linx Designer - free download](https://linx.software/get-started-and-download-linx-a-low-code-platform-for-developers/?utm_source=gh)
- [OAuth 2.0 framework overview](https://oauth.net/2/)

---

## Dependencies

### Pre-requisites

- Linx Designer `5.21.0.0` and above.

### Database

{information related to any database dependency}

---

## How it works?

The Linx Solution contains a REST webservice with the below operations:

- RequestAppAuthorization
- ExchangeAuthCode

---

## Setting up the sample

Registering a connected application

1. Register a new connected/oauth application on the chosen platform (GitHub, Facebook etc).
1. Configure the **callback/redirect URL** of the new app to be `http://locahost:8080/{platform name}/oauth/token`. So for example, if you are setting up a connected application for salesforce, the **callback/redirect URL** would be `http://locahost:8080/salesforce/oauth/token`
1. Save your registered app and generate a new `client secret`.
1. Copy your client identifiers (`client id` and `client secret`).

Configure the Linx Solution

1. Open the [provided sample](/Solution.lsoz) (`.lsoz`) in your Linx Designer.
2. Configure the Solution's `$.Settings` with the client identifiers generated from the step above. So for example, if you are dealing with 'GitHub' add the `client id` and `client secret` to the $.Settings values of `$.Settings.GitHubClientId`and`$.Settings.GitHubClientSecret`.

Sub-heading 3

1. Step to setup sample
1. Other steps
1. Some more steps

---

## Using the sample

---

Generating tokens
Follow the below steps to initiate the OAuth 2.0 flow between your chosen platforms authorization server and the provided sample Linx Solution:

1. Debug the RESTHost service in the Linx Designer.
2. Click on the relevant log in button below to initiate the OAuth 2.0 flow between your Linx Solution and the chosen Service Provider.
3. You will be redirected to the chosen service provider's login page.
4. Once logged in, grant the connected Linx application permission to access your account's resources.
5. A redirection request will be made by the platform's authorization server to the Linx web service with an authorization code.
6. Linx then makes a request back to the authorization server submitting client credentials and the authorization code.
7. The generated token is then logged locally.
8. An authorization summary containing details of the connected entity are returned and displayed to the user.

---

Storing tokens
Description: Description of functionality

Usage:

1. Step one
1. Step two
1. Step three

---

Making requests with access tokens
Description: Description of functionality

Usage:

1. Step one
1. Step two
1. Step three

# The mock api for dialog test case.

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app. The default port is 3000. You can change this value by specifing the enviroment variable **process.env.PORT**.

### `npm run dev`

Runs the app in the development mode.

### `npm run format`

Formats project by prettier.

### `npm run lint`

Checks code by eslint.

## OpenAPI

Open `/docs` to view documentation.

## Authentication

A Bearer Authentication is an authentication technique that provides every request to the server with a signed token. You should make a POST request to `/auth/sign-in` with credentials to get an access token. The access token needs to get an access to protected routes. The response also contains a refresh token. After 15 minutes the access token will expire and you need to refresh access token by making a POST request to `auth/refresh` with refresh token in a body.

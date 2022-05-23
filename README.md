# ShipStream Sample Connector

This project is a Node.js microservice which sits between ShipStream and another API and handles
shipping label requests and webhook events.

Search for and replace "REPLACEME" to replace some placeholders that may be useful for your integration.

This project uses [micro](https://github.com/vercel/micro#readme) to accept the standard
[http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) and
[http.ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse) objects. 

## Prerequisites

- Node v16+

## Environment Variables

The application code makes use of the following environment variables:

- `DEBUG` - Set '1' to enable detailed logging
- `NODE_ENV` - Use 'production' to enforce authentication on the request and disable `.env` file parsing
- `SHIPSTREAM_GLOBAL_API_URL` - Include '/api/global' - defaults to http://localhost:8888/api/global
- `SHIPSTREAM_GLOBAL_API_KEY` - Required for authentication (`X-AutomationV1-Auth` header value)
- `REPLACEME_BASE_URL` - Domain only - defaults to https://REPLACEME
- `REPLACEME_API_KEY` - Required for authentication

## Development

For local development create a `.env` file with the appropriate environment variables as described above.

Use Node.js and NPM to manage the project like any Node project:

- `npm install`

There are three ways to start the server for development:
- `npm start` to start a vanilla `micro` server
- `npm run dev` to start the development mode server [micro-dev](https://github.com/vercel/micro-dev) (hot reloading!)
- `npm run inspect` to start the server with the Node.js inspector

The [micro](https://github.com/vercel/micro) server listens by default on TCP port 3000. 

### Code Style

ESLint and Prettier are configured to keep code style consistent. Run manually before committing code:

```
npx prettier --write .
```

## Production

Make sure the environment variables are defined in the production environment. For cloud environments this is often
done via the cloud console but it should *not* be done with the `.env` file which will be ignored in production mode.

The production container is built using the `Dockerfile` and can run on any normal Docker environment.
Included are configurations to run this container in [Google Cloud Run](https://cloud.google.com/run)
using [Google Cloud Build](https://cloud.google.com/sdk/gcloud/reference/builds/submit) deployed with
either GitLab CI/CD or GitHub Actions.

### Service Account Setup

You must create a Service Account within the project and then Add this service account to the
GCP project with the following Roles:

- Cloud Build Service Account
- Cloud Run Admin
- Viewer (required to stream logs from `build submit` command)

Note, it may be possible to reduce Role footprint and you can also use the conditions to reduce access to other services, logs, etc.

### GitLab CI/CD

The files `.gitlab-ci.yml` and `cloudbuild.yaml` are used to deploy via GitLab CI/CD. The environment variables
required in the CI/CD environment are:

- `GCP_SERVICE_KEY` - the JSON formatted Cloud Run account credentials
- `GCP_PROJECT_ID` - the GCP Project "ID"

### GitHub Actions

The file `.github/workflows/deploy.yml` is used to deploy via GitHub Actions. The `cloudbuild.yaml` file is ignored.
The environment variables required in the GitHub Actions environment are:

- `GCP_SERVICE_KEY` - the JSON-formatted GCP Service Account credentials
- `GCP_PROJECT_ID` - the GCP Project "ID"
- `GCP_SERVICE_NAME` - the Cloud Run Service "Name"

If deploying to a new service the service will not allow unauthenticated requests by default so this must be changed
just once after deploy through the GCP Console.

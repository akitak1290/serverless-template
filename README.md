# A mini notification service

Stack:
- local cloud: LocalStack, Docker
- infra: Serverless Framework
- backend: nodejs, dynamodb sdk

## Overview
```
--------------------------------------------------------------------
|  localstack                                                      |
|                                                                  |
|                                                                  |
|  api_server --------> dynamodb                                   |
|                       dynamodb_stream                            |
|                             |                                    |
|                             |                                    |
|                             |                                    |
|                             --------> lambda func                |
|                                           |                      |
|                                           |                      |
|                                           |                      |
|                                           v                      |
|                                          ses ----> email         |
|                                                                  |
|                                                                  |
--------------------------------------------------------------------
```


## Project Structure
```
serverless/
├── server.js              # Express server (or raw Node) that writes to DynamoDB
├── handler.js             # Lambda logic (triggered by EventBridge or Stream)
├── serverless.yml         # Infra definition
├── docker-compose.yml     # Runs LocalStack
├── package.json
└── .env
```

## Quick Start
- Setup LocalStack with docker-compose
```
docker-compose up -d
```
- Deploy services to LocalStack
```
npm run deploy
```
- Start the api server
```
npm run start
```

- Register a sender identity manually using aws cli (update the email in serverless if needed)
```
aws --endpoint-url=http://localhost:4566 ses verify-email-identity --email-address no-reply@duckfarm.com
```

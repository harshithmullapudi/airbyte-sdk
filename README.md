# airbyte-sdk

## Disclaimer

The project is in **alpha** version.
Readers can refer to our [opened GitHub issues](https://github.com/harshithmullapudi/airbyte-sdk) to check the ongoing work on this project.

## What is `airbyte-sdk`?

airbyte-sdk is a package to manage Airbyte configurations through your code.
It can handle CRUD for sources, destinations, definitions and connections. It also has some commonly used functions to make the usage simpler.

## When should I use `airbyte-sdk`?

When you want to handle Airbyte configurations through some automation or through API. You can also make use of this while creating some scripts.

## Table of content

- [Install](#install)
- [Configuration](#configuration)
- [Classes and functions](#classes-functions)
- [Contributing](#contributing)
- [Example](#example)

## Install

Your project need to support node version 16 or above

Using npm:

```bash
$ npm install airbyte-sdk
```

Using yarn:

```bash
$ yarn add airbyte-sdk
```

## Configuration

You will have to provide the base url for the Airbyte instance.

```js
setAirbyteHost('http://localhost:8001/');
```

You can also set default headers as described below

```js
setAuthenticationHeaders(headers);
```

## Classes and functions

You can go through the following [URL](https://harshithmullapudi.github.io/airbyte-sdk/)

## Contributing

1. Go to https://github.com/harshithmullapudi/airbyte-sdk
2. Create an issue if the issue is not already created, attach a tag [Bug, Improvement]
3. Fork the repo, code and test thoroughly.
4. Open a PR on the repo from your fork.

## Examples

```js
var { setAirbyteHost, Source, WorkspaceModel } = require('airbyte-sdk');

async function main() {
  setAirbyteHost('http://localhost:8000');

  const workspaceModel = await WorkspaceModel.createWorkspaceInstanceFromId(
    '29cfb153-40a9-478a-a37c-f519560459b2',
  );
  const source = new Source(workspaceModel);
  const allSources = await source.getAllSources();
  console.log(allSources);
}

main();
```

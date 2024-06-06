# nuxt-concierge

Queues, workers and background jobs for nuxt

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- Create queues and workers based on bullmq
- Create scheduled tasks
- UI for managing jobs
- Autoscan and initialize queues automatically
- Dynamically create new queues and workers
- Ability to integrate with external queues and workers

## Quick Setup

1. Add `nuxt-concierge` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-concierge

# Using yarn
yarn add --dev nuxt-concierge

# Using npm
npm install --save-dev nuxt-concierge
```

2. Add `nuxt-concierge` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: ["nuxt-concierge"],
  concierge: {
    redis: {
      host: "localhost",
      port: 6379,
      password: "",
    },
  },
});
```

Use the `redis` option to configure the redis connection, or use the `redis` environment variables:

```bash
NUXT_CONCIERGE_REDIS_HOST='localhost'
NUXT_CONCIERGE_REDIS_PORT=6379
NUXT_CONCIERGE_REDIS_PASSWORD=''
```

**Note**: A redis connection **is required** for this module to work.

## Usage

### Creating Queues

There are two ways to create queues.

1. Inline using options

We call this **Simple Queues** because only a queue name is needed. To create a simple queue:

```ts
concierge: {
  queues: ["SendEmail"],
},

```

2. The second method for creating queues is by defining it using `defineQueue`.

For example:

`/concierge/queues/my-queue.ts`:

```ts
import { defineQueue } from "#concierge-handlers";

export default defineQueue("SendEmail", {
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
});
```

**NOTE**: your queue must be created in the `/concierge/queues` folder

The second parameter gives you full control over the queue behavior

### Creating Workers

For jobs to be processed at least one worker is required. Workers don't have to necessarily be running in a nuxt, but if you want to manage workers in nuxt, you can create one using `defineWorker`

For example:

`/concierge/workers/my-worker.ts`:

```ts
import { defineWorker } from "#concierge-handlers";

export default defineWorker("SendEmail", async (job) => {
  const { to } = job.data;

  // send customer email
});
```

Workers defined this way will **automatically be started** during application startup

**NOTE**: your workers must be created in the `/concierge/workers` folder

### Creating CRON Jobs

Cron jobs can be created using the `defineCron` helper.

For example:

`/concierge/cron/daily-report.ts`:

```ts
import { defineCron } from "#concierge-handlers";

export default defineCron(
  "DailySalesReport",
  async () => {
    // Run a daily report
  },
  {
    every: 43200000, // 12 hours
    immediately: true,
  }
);
```

Cron jobs are placed in a special queue called `CRON`. This queue is automatically created for you.

**NOTE**: your cron must be created in the `/concierge/cron` folder

### Accessing queues

To access queues, a `getQueue` helper is provided.

```ts
import { $useConcierge } from "#concierge";

export default defineEventHandler(async (event) => {
  const { getQueue } = $useConcierge();
  const emailQueue = getQueue("SendEmail");

  await emailQueue.add("sendWelcomeEmail", { to: "customer@helloworld.com" });

  return true;
});
```

This would add a job to the queue and will be processed by the worker.

### Queue Management UI

The Concierge dashboard can be accessed at:

http://localhost:3000/\_concierge/

## FAQ

1. **Does this work in a serverless environment?**

Yes and no, but mostly no. Serverless environments typically have a timeout, so workers will not be able to run in the backgorund to reliably process jobs. If you want to use this module in a serverless environment, I recommend to deploy your workers elsewhere, and just reference the queues in this module. This way you can still leverage the other features, like queue management, and ui.

2. **Can I disable the Queue management UI in production?**

The management UI is already disabled by default in production. If you want't to enable it in production, you must enable it explicitly in the options:

```ts
export default defineNuxtConfig({
  concierge: {
    redis: {
      host: "...",
    },
    managementUI: true,
  },
});
```

3. **Can I password protect the Queue management UI?**

Auth for the UI is out of scope of this module, but it can easily be done using the [Nuxt Security](https://nuxt-security.vercel.app/)

## Development

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm dev:prepare

# Develop with the playground
pnpm dev

# Build the playground
pnpm dev:build

# Run ESLint
pnpm lint

# Run Vitest
pnpm test
pnpm test:watch

# Release new version
pnpm release
```

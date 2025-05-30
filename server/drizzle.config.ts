import { env } from '@/env'

import type { Config } from 'drizzle-kit'

export default {
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: 'postgresql',
  schema: './src/infra/db/schemas/*.ts',
  out: './db/migrations',
  verbose: true,
  strict: true,
} satisfies Config

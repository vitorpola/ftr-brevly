import { pgTable, text, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const links = pgTable('links', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull().unique(),
  accessCount: integer('access_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

import { pgTable, text, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const links = pgTable('links', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  short_url: text('short_url').notNull().unique(),
  original_url: text('original_url').notNull(),
  access_count: integer('access_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

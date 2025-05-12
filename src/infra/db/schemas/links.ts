import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable('links', {
  id: uuid('id').primaryKey(),
  key: text('key').notNull().unique(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

ALTER TABLE "links" RENAME COLUMN "key" TO "short_url";--> statement-breakpoint
ALTER TABLE "links" RENAME COLUMN "url" TO "original_url";--> statement-breakpoint
ALTER TABLE "links" DROP CONSTRAINT "links_key_unique";--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "access_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_short_url_unique" UNIQUE("short_url");
CREATE TABLE "links" (
	"id" uuid PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_key_unique" UNIQUE("key")
);

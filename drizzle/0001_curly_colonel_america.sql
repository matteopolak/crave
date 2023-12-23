ALTER TABLE "recipe" ALTER COLUMN "url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "verified" boolean DEFAULT false NOT NULL;
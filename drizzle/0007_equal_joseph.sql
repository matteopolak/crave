ALTER TABLE "recipe" ALTER COLUMN "notes" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "recipe" ALTER COLUMN "notes" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe" ALTER COLUMN "description" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "recipe" ALTER COLUMN "description" DROP NOT NULL;
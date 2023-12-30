CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS tsm_system_rows; 
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"recipe_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "like" (
	"user_id" text NOT NULL,
	"recipe_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipe" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"embedding" vector(768),
	"title" text NOT NULL,
	"thumbnail" text NOT NULL,
	"url" text NOT NULL,
	"quantities" text[] NOT NULL,
	"directions" text[] NOT NULL,
	"ingredients" text[] NOT NULL,
	"energy" real NOT NULL,
	"fat" real NOT NULL,
	"saturated_fat" real NOT NULL,
	"protein" real NOT NULL,
	"salt" real NOT NULL,
	"sugar" real NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recipe_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription" (
	"user_id" text NOT NULL,
	"channel_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"username" varchar(39) NOT NULL,
	"embedding" vector(768),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_key" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"hashed_password" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_session" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "history_user_id_index" ON "history" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "history_recipe_id_index" ON "history" ("recipe_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "like_user_id_index" ON "like" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "like_recipe_id_index" ON "like" ("recipe_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipe_author_id_index" ON "recipe" ("author_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recipe_embedding_index" ON "recipe" USING hnsw ("embedding" vector_ip_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscription_user_id_index" ON "subscription" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscription_channel_id_index" ON "subscription" ("channel_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "history" ADD CONSTRAINT "history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "history" ADD CONSTRAINT "history_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "like" ADD CONSTRAINT "like_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "like" ADD CONSTRAINT "like_recipe_id_recipe_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recipe" ADD CONSTRAINT "recipe_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_channel_id_user_id_fk" FOREIGN KEY ("channel_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_key" ADD CONSTRAINT "user_key_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_session" ADD CONSTRAINT "user_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE PROCEDURE IF NOT EXISTS add_history(
  user_id TEXT,
  recipe_id INTEGER
) LANGUAGE plpgsql
AS $$
#variable_conflict use_variable
DECLARE
  last_recipe_id INTEGER;
BEGIN
  SELECT
    history.recipe_id INTO last_recipe_id
  FROM history
  WHERE history.user_id = user_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND OR last_recipe_id != recipe_id THEN
    INSERT INTO history (user_id, recipe_id) VALUES (user_id, recipe_id);
  END IF;
END $$;
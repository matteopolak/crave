# Crave

[![License](https://img.shields.io/github/license/matteopolak/crave.svg)](https://github.com/matteopolak/crave/blob/main/LICENSE)

YouTube-like recipe explorer with semantic recommendations and powerful search.

## Setting up the database

```sql
-- `vector` or `pgvector`
CREATE EXTENSION vector;
CREATE EXTENSION tsm_system_rows; 

-- Create the recipe table
CREATE TABLE recipe (
  id SERIAL PRIMARY KEY,
  author_id TEXT NOT NULL REFERENCES "user" (id),
  embedding vector(768),
 
  title TEXT NOT NULL UNIQUE,
  thumbnail TEXT NOT NULL,
  url TEXT NOT NULL,

  quantities TEXT[] NOT NULL,
  directions TEXT[] NOT NULL,
  ingredients TEXT[] NOT NULL,
 
  energy REAL NOT NULL,
  fat REAL NOT NULL,
  saturated_fat REAL NOT NULL,
  protein REAL NOT NULL,
  salt REAL NOT NULL,
  sugar REAL NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Keep track of a user's recipe viewing history
CREATE TABLE history (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES "user" (id),
  recipe_id INTEGER NOT NULL REFERENCES recipe (id),
 
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Keep track of a user's subscriptions
CREATE TABLE subscription (
  user_id TEXT NOT NULL REFERENCES "user" (id),
  channel_id TEXT NOT NULL REFERENCES "user" (id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  PRIMARY KEY (user_id, channel_id)
);

-- Keep track of a user's likes
CREATE TABLE "like" (
  user_id TEXT NOT NULL REFERENCES "user" (id),
  recipe_id INTEGER NOT NULL REFERENCES recipe (id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  PRIMARY KEY (user_id, recipe_id)
);

CREATE PROCEDURE add_history(
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

-- Use an inner product similarity index
CREATE INDEX ON recipe USING hnsw (embedding vector_ip_ops);
```

## Setting up lucia

See [Lucia's documentation](https://lucia-auth.com/database-adapters/pg/) for more information.

```sql
CREATE TABLE "user" (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  username VARCHAR(39) NOT NULL UNIQUE,
  embedding vector(768),

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE user_key (
  id TEXT NOT NULL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES "user" (id),
  hashed_password TEXT
);

CREATE TABLE user_session (
  id TEXT NOT NULL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES "user" (id),
  active_expires BIGINT NOT NULL,
  idle_expires BIGINT NOT NULL
);
```

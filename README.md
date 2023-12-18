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
  embedding vector(768),
  title TEXT NOT NULL UNIQUE,
  quantities TEXT[] NOT NULL,
  directions TEXT[] NOT NULL,
  ingredients TEXT[] NOT NULL,
  energy REAL NOT NULL,
  fat REAL NOT NULL,
  saturated_fat REAL NOT NULL,
  protein REAL NOT NULL,
  salt REAL NOT NULL,
  sugar REAL NOT NULL,
  thumbnail TEXT NOT NULL,
  url TEXT NOT NULL
);

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
  embedding vector(768)
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

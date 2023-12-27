# Crave

[![build status](https://github.com/matteopolak/jukebox/actions/workflows/ci.yml/badge.svg)](.github/workflows/ci.yml)
[![license](https://img.shields.io/github/license/matteopolak/crave.svg)](LICENSE)

YouTube-like recipe explorer with semantic recommendations and powerful search.

## Features

- [x] Related recipe recommendations
- [x] Semantic search
- [x] Create your own recipes
- [x] Like functionality
- [x] Recently viewed recipes
- [x] Recently liked recipes
- [x] Localization support with automatic language detection
- [x] Dark mode

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en) (>= 20.0.0)
- [Pnpm](https://pnpm.io) (>= 8.0.0)
- [Python](https://www.python.org) (>= 3.10.0)
- [PostgreSQL](https://www.postgresql.org) (>= 15.0.0)
- [pgvector](https://github.com/pgvector/pgvector)

### Setup

1. Clone the repository

```bash
git clone https://github.com/matteopolak/crave
```

2. Install dependencies

```bash
pnpm install
pip install -r text_embedder/requirements.txt
```

3. Copy the `.env.example` file to `.env` and fill in the required values

### Usage

1. Build the project

```bash
pnpm build
```

2. Start the server

```bash
node build
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

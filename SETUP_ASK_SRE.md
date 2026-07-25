# ask-sre Setup Guide

SeekrAI integrates with [ask-sre](https://gitlab.cee.redhat.com/service/ask-sre) for semantic SOP document search. When running, ask-sre results appear alongside regular GitHub/GitLab code search results with similarity scores, categories, and severity badges.

## Prerequisites

- Python 3.13+
- Poetry (`curl -sSL https://install.python-poetry.org | python3 -`)
- Podman or Docker (for PostgreSQL)
- Local copy of the `ops-sop` repository

## Setup Steps

### 1. Start PostgreSQL with pgvector

```bash
podman run -d --name pgvector \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=ask_sre_db \
  -p 5432:5432 \
  pgvector/pgvector:pg18-trixie
```

### 2. Clone and install ask-sre

```bash
git clone https://gitlab.cee.redhat.com/service/ask-sre.git
cd ask-sre
poetry install
```

### 3. Configure environment

```bash
cp config.example.env .env
```

Edit `.env` with your settings:

```
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=ask_sre_db
PG_USER=postgres
PG_PASSWORD=postgres
EMBEDDINGS_MODEL=sentence-t5-base
OPS_SOP_DOCS_PATH=/path/to/your/ops-sop
```

### 4. Build the embeddings database

```bash
poetry run ask-sre index --source-path /path/to/ops-sop
```

This creates vector embeddings from ~776 markdown files (~8,487 searchable chunks). Takes ~10-30 minutes on first run.

### 5. Start the MCP server

```bash
poetry run ask-sre mcp --transport http --host 0.0.0.0 --port 8000
```

SeekrAI expects ask-sre on port 8000 by default. To use a different port, set the `MCP_SERVER_URL` environment variable before starting `unified_search.py`:

```bash
export MCP_SERVER_URL=http://localhost:9000
```

## How it works

When you search in SeekrAI:

1. `search_sop()` calls ask-sre's `search_sre_docs` tool via MCP JSON-RPC
2. ask-sre returns semantically matched documents with similarity scores
3. Results are merged into the appropriate sections:
   - `local_ops_sop` results appear in the **GitLab** section
   - `managed_openshift_docs` results appear in the **GitHub** section
   - `redhat_customer_portal` results appear in the **KCS** section
4. ask-sre results are visually distinct with green "SOP" badges, similarity percentages, category/severity labels

## Graceful degradation

If ask-sre is not running, SeekrAI continues to work normally. GitHub and GitLab sections show their regular code search results without semantic SOP matches. No errors are displayed to the user.

## Verification

```bash
# Check ask-sre is running
curl -s http://localhost:8000/mcp/ \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' \
  | head -c 200
```

If you see a JSON-RPC response, ask-sre is running and ready.

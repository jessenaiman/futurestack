# Unified Project Plan: Traefik Stack & Basic Memory MCP

## Overview
This document merges the Traefik Unified Stack Project Plan with the Basic Memory MCP Server documentation for a single source of truth on setup, troubleshooting, and best practices.

---

## 1. Stack Architecture & Service List

- **Core Infrastructure:**
  - Traefik (reverse proxy)
  - PostgreSQL
  - MinIO
- **Monitoring & Management:**
  - Grafana
  - Portainer
  - Prometheus
- **Application Services:**
  - Open-WebUI
  - OpenHands
  - Status Page (Astro)
- **AI & Vector DB:**
  - Neo4j (with neo4j-memory and neo4j-cypher tools)
- **Optional/Experimental:**
  - Coolify
  - Flowise
  - Rabbit Holes
- **Knowledge Management:**
  - Basic Memory MCP Server (Obsidian integration)

---

## 2. MCP: Basic Memory & Neo4j Tools

### Basic Memory Tools
- `build_context`, `canvas`, `delete_note`, `project_info`, `read_content`, `read_note`, `recent_activity`, `search_notes`, `write_note`
- See [docs/basic-memory.md](docs/basic-memory.md) for full tool details.

### Neo4j Tools
- `neo4j-memory` and `neo4j-cypher` containers for semantic graph and Cypher queries.
- Ensure Neo4j is running and accessible at `bolt://host.docker.internal:7687`.

---

## 3. Deployment & Troubleshooting Checklist

- [ ] Set all required environment variables (see project_plan.md)
- [ ] Ensure no container name conflicts (`docker system prune -f`)
- [ ] Fix any path/context errors in compose files
- [ ] Start stack: `docker compose up -d`
- [ ] Test Neo4j connection using MCP_DOCKER tools
- [ ] Test Basic Memory tools via MCP_DOCKER
- [ ] Use Playwright/E2E tests in `e2e/` folder
- [ ] Monitor with Grafana/Prometheus

---

## 4. Best Practices
- Use `.env` files and Docker secrets for sensitive config
- Modularize compose files in `docker_servers/`
- Use Traefik labels for secure, controlled exposure
- Document all changes in this file and memory-mcp

---

## 5. References
- [basic-memory GitHub](https://github.com/basicmachines-co/basic-memory)
- [Traefik Guide](TRAEFIK_GUIDE.md)
- [Neo4j Docs](https://neo4j.com/docs/)
- [Project Plan](project_plan.md)
- [Basic Memory Tools](docs/basic-memory.md)

---

## 6. References & Knowledge Management
- See [Service Integration Best Practices](../obsidian-vault/future-stack/memory-mcp/service-integration-best-practices.md) for canonical integration steps and troubleshooting.
- All integration knowledge is captured in the Obsidian vault using basic-memory tools.

---
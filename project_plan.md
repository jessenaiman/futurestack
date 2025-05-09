# Traefik Unified Stack Project Plan

## Overview
This project plan outlines the steps and best practices for setting up a unified web server stack using Traefik as the reverse proxy, alongside various services like Open-WebUI, Rabbit Holes, OpenHands, Grafana, Prometheus, and a status page. The goal is to ensure all services are accessible via a browser through a centralized status page, with a focus on security, modularity, and ease of management.

**Update:**
- The service startup order has been professionally rearranged: Core infrastructure (Traefik, PostgreSQL, MinIO), then monitoring/management (Prometheus, Grafana, Portainer), then application services (Open-WebUI, OpenHands, Status Page), and finally Rabbit Holes (last, for easy exclusion).
- The deployment script now outputs each service's official GitHub and documentation URLs in the terminal for easier troubleshooting and verification.

## Top Priority: Resolve Current Deployment Errors
Below is a systematic list of errors and warnings from the latest Docker Compose deployment attempts. These must be resolved sequentially before proceeding with other tasks.

### 1. Missing Environment Variables
- [ ] Set `TRAEFIK_ACME_EMAIL` for Let's Encrypt notifications.
- [x] Set `OLLAMA_BASE_URL` for Open-WebUI connectivity.
- [x] Set `TAVILY_API_KEY`, `GOOGLE_AI_API_KEY`, and `GOOGLE_AI_MODEL` for Rabbit Holes.
- [ ] Set `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB_VECTOR` for PostgreSQL.
- [ ] Set `OPENAI_API_KEY` and `LLM_MODEL` for AI services.
- [ ] Set `GF_SECURITY_ADMIN_USER` and `GF_SECURITY_ADMIN_PASSWORD` for Grafana.

### 2. Container Conflicts
- [ ] Ensure no container name conflicts by running `docker system prune -f` before each start attempt (partially resolved).

### 3. Path and Context Errors
- [ ] Fix Rabbit Holes path error: `/home/jesse/futurestack/path/to/your/rabbitholes/source` not found. **Action**: Update `docker-compose.rabbitholes.yml` to point to the correct source directory or ensure Docker image is built from the repository's Dockerfile.
- [x] Set `TAVILY_API_KEY` and `GOOGLE_AI_API_KEY` environment variables for Rabbit Holes as per repository instructions.
- [ ] Fix Status Page path error: `/home/jesse/futurestack/docker_servers/status-astro` not found.
- [ ] Resolve Prometheus mount error related to WSL/Docker Desktop bind mounts.

### 4. Service Startup Failures
- [ ] Ensure Open-WebUI starts after setting required variables.
- [ ] Ensure Rabbit Holes starts after fixing path issues and variables.
- [ ] Ensure Status Page starts after fixing path issues.
- [ ] Ensure Prometheus starts after resolving mount issues.

### 5. Directory Structure Consistency
- [x] Create dedicated directories for each major service (e.g., Open-WebUI, Rabbit Holes, OpenHands, Grafana, Portainer, Status Page) within `docker_servers` to store configuration files and data, mirroring the structure used for Traefik and Prometheus. This enhances modularity and ease of management.
- [ ] Use these directories as logical subdirectories to clone repositories only when necessary for local development or customization. Always check if cloning is required, as often only configuration values are needed.
- [ ] Securely manage `.env` values and other configuration settings using Docker secrets or environment files, ensuring sensitive data is not exposed in version control.

### 6. Testing Environment Setup
- [ ] Containerize E2E and Puppeteer testing environments using Docker to ensure isolation, reproducibility, and scalability. This safeguards against breaking functionality when adding new services.
- [ ] Create a dedicated `docker_servers/testing` directory with a `docker-compose.testing.yml` file to define testing services (e.g., Playwright, Puppeteer).
- [ ] Integrate testing into CI/CD pipelines to automate verification of service functionality after updates or new service additions.

## Priority Task Groupings

### 1. Core Infrastructure Setup (High Priority)
- [ ] Start unified stack (Traefik + core services)
    - [ ] Resolve Traefik port conflict (address already in use)
- [ ] Use a dedicated external Docker network for Traefik and all web services
- [ ] Set `exposedByDefault: false` in Traefik's Docker provider
- [ ] Use `traefik.enable=true` label only on services to be exposed
- [ ] Use `.env` files for secrets and configuration
- [ ] Store static Traefik config (entrypoints, providers, resolvers) in a YAML file
- [ ] Store dynamic Traefik config (middlewares, TLS options) in a separate file or via labels
- [ ] Use Let's Encrypt for HTTPS with DNS or HTTP challenge, store certs in a mounted file (e.g., `acme.json`)
- [ ] Use the `domains` array in Traefik labels for multi-domain/wildcard certs
- [ ] Set `read_only: true` and `no-new-privileges: true` for the Traefik container
- [ ] Implement Docker Compose `include:` feature to modularize configuration files, allowing for team-based development and easier management. Example:
  ```yaml
  include:
    - docker_servers/docker-compose.traefik.yml
    - docker_servers/docker-compose.prometheus.yml
  ```
- [ ] Use Docker Compose `profiles` to control service startup for different environments (dev, test, prod).
- [ ] Utilize Docker Compose `secrets` for both runtime and build-time to securely manage sensitive data. Example:
  ```yaml
  secrets:
    my_secret:
      file: ./my_secret.txt
  ```
- [ ] Leverage `develop.watch` feature in Docker Compose for live code reloads during development of custom services or status pages.

### 2. Service Deployment & Organization
- [ ] Archive Coolify as a 'nice-to-have' service to focus on Traefik and core services
- [ ] Move all active Docker Compose files to a professional 'docker_servers' folder
- [ ] Use Python or TypeScript for startup scripts to ensure cross-OS compatibility (instead of PS1 scripts)
- [ ] Reconnect GitHub MCP access for documenting and updating issues once most services are confirmed running
- [ ] Update `.gitignore` to exclude cloned repository code files from version control to avoid duplicate maintenance and context clutter on personal servers. Example:
  ```
  # Exclude cloned repositories for services
  docker_servers/*/src/
  docker_servers/*/repo/
  ```

### 3. Testing & Monitoring
- [ ] Deploy/serve status page
- [ ] Test each service link manually
- [ ] Test each service link with Playwright (see `e2e/` folder)
- [ ] Install and configure Prometheus and Grafana for monitoring
- [ ] Install and configure Portainer for container management
- [ ] Note: Monitor memory usage. Recommended minimum RAM for this stack is 64GB; with tuning and memory limits, 32GB may be possible but not ideal for heavy workloads.

### 4. Documentation & Maintenance
- [ ] Keep all technical documentation in memory-mcp or retrievable with context7
- [ ] Regularly prune outdated/conflicting information from memory-mcp
- [ ] Organize and professionally maintain GitHub issues

---

**Progress and updates will be tracked here.**

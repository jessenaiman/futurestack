# Webserver Installation Project

- [ ] Create GitHub Issue for tracking (Link: TBD)
- [ ] Set up .env file with all required variables

## Service Installation Checklist:

### Traefik:
- [ ] Review and finalize `docker-compose.base.yml` configuration
- [ ] Decide on local HTTPS strategy (HTTP, mkcert, etc.) and configure Traefik
- [ ] Test Traefik dashboard access (securely)
- [ ] Test basic HTTP->HTTPS redirection

### MinIO:
- [ ] Review MinIO configuration in `docker-compose.base.yml`
- [ ] Test MinIO console access
- [ ] Create necessary buckets for services

### PostgreSQL:
- [ ] Review PostgreSQL configuration in `docker-compose.base.yml`
- [ ] Verify databases are created (or plan for manual creation/init script)

### Coolify:
- [ ] Review and finalize `docker-compose.coolify.yml`
- [ ] Verify environment variables for DB and Redis connections
- [ ] Test Coolify access via Traefik (`coolify.${DOMAIN:-localhost}`)

### OpenWebUI:
- [ ] Review and finalize `docker-compose.openwebui.yml`
- [ ] Verify environment variables for Ollama connection
- [ ] Test OpenWebUI access via Traefik (`webui.${DOMAIN:-localhost}`)
- [ ] Test connection to Ollama

### Rabbit-Holes:
- [ ] **Address Build Context:** Update `docker-compose.rabbitholes.yml` to point to external source or use a pre-built image.
- [ ] Review and finalize `docker-compose.rabbitholes.yml` configuration
- [ ] Verify environment variables (API keys, DB connection)
- [ ] Test Rabbit-Holes access via Traefik (`rabbitholes.${DOMAIN:-localhost}`)

### OpenHands:
- [ ] Review and finalize `docker-compose.openhands.yml`
- [ ] Update workspace volume path to your external workspace
- [ ] Verify environment variables (LLM API keys)
- [ ] Test OpenHands access via Traefik (`openhands.${DOMAIN:-localhost}`)
- [ ] Investigate S3 integration if required by specific OpenHands features/plugins

### Puppeteer:
- [ ] Review and finalize `docker-compose.puppeteer.yml`
- [ ] Confirm/Configure X11 setup or use headless mode
- [ ] Implement initial test script(s)
- [ ] Run Puppeteer tests against services via Traefik hostnames

## General:
- [ ] Implement comprehensive Puppeteer test suite
- [ ] Refine security configurations (non-insecure Traefik API, stronger passwords, etc.)
- [ ] Document setup and usage in a README.md
- [ ] Consider adding DeepWiki Open to the stack (research required)

- [x] Research and implement monitoring (Prometheus, Grafana, cAdvisor)
- [x] Configure Traefik metrics for monitoring
- [ ] Deploy Prometheus and Grafana containers
- [ ] Configure Prometheus to scrape Traefik metrics
- [ ] Configure Grafana with Prometheus data source
- [ ] Import or create Grafana dashboards for visualization

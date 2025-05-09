# Traefik Unified Stack Project Plan

## Overview
This project plan outlines the steps and best practices for setting up a unified web server stack using Traefik as the reverse proxy, alongside various services like Open-WebUI, Rabbit Holes, OpenHands, Grafana, Prometheus, and a status page. The goal is to ensure all services are accessible via a browser through a centralized status page, with a focus on security, modularity, and ease of management.

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

### 2. Service Deployment & Organization
- [ ] Archive Coolify as a 'nice-to-have' service to focus on Traefik and core services
- [ ] Move all active Docker Compose files to a professional 'docker_servers' folder
- [ ] Use Python or TypeScript for startup scripts to ensure cross-OS compatibility (instead of PS1 scripts)
- [ ] Reconnect GitHub MCP access for documenting and updating issues once most services are confirmed running

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

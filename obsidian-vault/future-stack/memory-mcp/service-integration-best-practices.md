# Service Integration Best Practices (Docker + Traefik + basic-memory)

## Overview
This note documents the professional, DRY, and best-practice approach for integrating new services into the unified Traefik stack, using Docker Compose and basic-memory for documentation and knowledge management.

---

## 1. Follow Upstream Documentation
- Clone or set up each service in the recommended directory (e.g., `docker_servers/<service>`), as per the official GitHub or documentation.
- Do not move, duplicate, or restructure unless required for orchestration.

## 2. Compose File Management
- Use the upstream `docker-compose.yml` for each service as-is.
- Add Traefik labels, network config, or other overrides in the root `docker-compose.yml` under a `services:` block, referencing the service name.
- Use `expose` for internal ports, not `ports`, to avoid conflicts. Let Traefik handle all external routing.

## 3. Environment Variables
- Set all required variables in the root `.env` file.
- Reference them in all compose files using `${VAR_NAME}` syntax.
- Document all required variables in `.env.example`.

## 4. Startup & Management
- Start the stack with `docker compose up -d` from the root. Compose will process all includes and overrides.
- Use Portainer for management and visibility, not for resolving port conflicts.

## 5. Documentation & Knowledge Capture
- Document all integration steps, troubleshooting, and best practices in this vault using basic-memory tools.
- Reference this note in `UNIFIED_PROJECT_PLAN.md` and keep it updated as the stack evolves.

---

## Example: Integrating Rabbit Holes
1. Clone the repo into `docker_servers/rabbitholes` as per upstream docs.
2. Set required API keys in `.env`.
3. Add any Traefik/network overrides in the root `docker-compose.yml`:
   ```yaml
   services:
     rabbitholes:
       labels:
         - "traefik.enable=true"
         - "traefik.http.routers.rabbitholes.rule=Host(`rabbitholes.${DOMAIN:-localhost}`)"
         - "traefik.http.services.rabbitholes.loadbalancer.server.port=3001"
       networks:
         - server-net
         - traefik-net
   ```
4. Start the stack: `docker compose up -d`
5. Document any issues or customizations here.

---

*This note is the canonical reference for service integration in the unified stack. Update as needed.*

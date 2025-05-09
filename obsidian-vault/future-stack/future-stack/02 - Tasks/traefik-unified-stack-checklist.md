# Traefik Unified Stack Best Practices Checklist

- [ ] Use a dedicated external Docker network (e.g., `proxy` or `traefik-net`) for Traefik and all web services
- [ ] Set `exposedByDefault: false` in Traefik's Docker provider
- [ ] Use `traefik.enable=true` label only on services to be exposed
- [ ] Use `.env` files for secrets and configuration
- [ ] Define Traefik labels on each service for routing, entrypoints, TLS, and middleware
- [ ] Store static Traefik config (entrypoints, providers, resolvers) in a YAML file
- [ ] Store dynamic Traefik config (middlewares, TLS options) in a separate file or via labels
- [ ] Use Let's Encrypt for HTTPS with DNS or HTTP challenge, store certs in a mounted file (e.g., `acme.json`)
- [ ] Use the `domains` array in Traefik labels for multi-domain/wildcard certs
- [ ] Set `read_only: true` and `no-new-privileges: true` for the Traefik container
- [ ] Optionally, use a Docker Socket Proxy for least-privilege Docker API access
- [ ] Add health checks to all services
- [ ] Document a single startup command/script for unified stack startup
- [ ] Test endpoints after startup using browser or automated tools (e.g., Puppeteer/Playwright)

---

_References: See memory-mcp/docker-latest-features.md for details and links._

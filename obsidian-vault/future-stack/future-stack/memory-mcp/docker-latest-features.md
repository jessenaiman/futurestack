

## Traefik Best Practices for Unifying Web Services (2024)

- Use a dedicated external Docker network (e.g., `proxy` or `traefik-net`) that all web services and Traefik join. This allows Traefik to route to any service, even if defined in separate Compose files or stacks.
- Set `exposedByDefault: false` in Traefik's Docker provider, and use `traefik.enable=true` label on only the services you want exposed.
- Use `.env` files for secrets and configuration, referenced in Compose and Traefik config.
- Use Traefik labels on each service to define routing rules, entrypoints, TLS, and middleware (e.g., HTTP->HTTPS redirect, BasicAuth, IP allowlist).
- Store static Traefik config (entrypoints, providers, resolvers) in a YAML file, and dynamic config (middlewares, TLS options) in a separate file or via labels.
- For HTTPS, use Let's Encrypt with DNS or HTTP challenge, and store certs in a mounted file (e.g., `acme.json`).
- For multi-domain/wildcard certs, use the `domains` array in Traefik labels.
- Use `read_only: true` and `no-new-privileges: true` for Traefik container security.
- Optionally, use a Docker Socket Proxy for least-privilege access to the Docker API.
- Add health checks to all services for better status reporting.
- Document a single startup command/script that brings up Traefik and all web services on the shared network.
- Test endpoints after startup using browser or automated tools (e.g., Puppeteer/Playwright).

References:
- https://www.spad.uk/posts/practical-configuration-of-traefik-as-a-reverse-proxy-for-docker-updated-for-2023/
- https://doc.traefik.io/traefik/user-guides/docker-compose/basic-example/
- https://github.com/glics/traefik-docker-compose

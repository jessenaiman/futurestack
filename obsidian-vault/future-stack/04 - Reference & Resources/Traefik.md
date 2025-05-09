# Traefik

**Role:** Reverse Proxy  
**Description:** Routes traffic to all services with TLS support.  
**GitHub:** [traefik/traefik](https://github.com/traefik/traefik)

## Quick Docker Compose Example

```yaml
version: '3'
services:
  reverse-proxy:
    image: traefik:v3.4
    command: --api.insecure=true --providers.docker
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

## Key Features
- Automatic service discovery
- TLS termination (Let's Encrypt support)
- Web dashboard
- Middleware and advanced routing

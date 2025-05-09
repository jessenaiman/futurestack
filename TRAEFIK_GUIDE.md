# Traefik Quick-Start Guide

This guide covers how to use Traefik as the reverse proxy for your AI services, Coolify, and future projects like portfolio websites.

## What is Traefik?

Traefik is a modern HTTP reverse proxy and load balancer that makes deploying microservices easy. It automatically discovers your services and handles the routing, SSL certificates, and more.

## Benefits Over Nginx

- **Automatic service discovery**: No manual configuration needed when adding new services
- **Automatic SSL certificates**: Integrated Let's Encrypt support
- **Real-time configuration**: No restarts needed when adding new services
- **Dashboard**: Web UI for monitoring and configuration
- **Modern middleware**: Advanced security headers, rate limiting, etc.
- **Docker integration**: First-class Docker support

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Basic understanding of YAML files
- A domain name (for production deployment - optional for local testing)

### Directory Structure

```
traefik/
├── acme/            # Let's Encrypt certificates
├── certs/           # Manual SSL certificates (if needed)
└── config/          # Traefik configuration files
    ├── dynamic-conf.yml  # Dynamic configuration (middlewares, TLS options)
```

### Starting Traefik with All Services (Including Coolify)

1. Use the switch_to_traefik.sh script to fully migrate to Traefik and set up Coolify:

   ```bash
   ./scripts/switch_to_traefik.sh
   ```

   During setup, you'll be prompted for:
   - Your production domain (optional - you can test with just localhost)
   - Your email for Let's Encrypt certificates (if using a production domain)

2. Access your services locally:
   - AutoGen Studio: <http://autogen.localhost>
   - Open WebUI: <http://webui.localhost>  
   - All-Hands: <http://openhands.localhost>
   - Coolify: <http://coolify.localhost>
   - Traefik Dashboard: <http://traefik.localhost:8080/dashboard/> (admin:admin)

3. Or access them remotely (if you provided a production domain):
   - AutoGen Studio: <https://autogen.yourdomain.com>
   - Open WebUI: <https://webui.yourdomain.com>  
   - All-Hands: <https://openhands.yourdomain.com>
   - Coolify: <https://coolify.yourdomain.com>
   - Traefik Dashboard: <https://traefik.yourdomain.com> (admin:admin)

## Dual Environment Setup (Local & Production)

The system is configured to support both local development and production environments simultaneously:

1. **Local development**:
   - Uses `.localhost` domains (e.g., `coolify.localhost`)
   - Works without DNS configuration
   - HTTP protocol for simplicity
   - Perfect for testing and development

2. **Production deployment**:
   - Uses your custom domain (e.g., `coolify.yourdomain.com`)
   - Requires proper DNS configuration pointing to your server
   - HTTPS with automatic Let's Encrypt certificates
   - Suitable for public access and production use

To test the configuration in different environments:

```bash
# Test local configuration
node scripts/check_traefik.js

# Test production configuration
NODE_ENV=production node scripts/check_traefik.js
```

## Coolify Integration

Coolify is now integrated with the Traefik stack, which allows you to:

1. Manage your services through the Coolify dashboard
2. Deploy new applications with automatic Traefik integration
3. Centralize configuration and monitoring

To get started with Coolify:

1. Visit <http://coolify.localhost> or <https://coolify.yourdomain.com> and complete the initial setup
2. Set up your projects and deployments through the Coolify interface
3. Traefik will automatically discover and route traffic to your Coolify-managed services

To test Coolify specifically:

```bash
# Test local Coolify configuration
node scripts/check_coolify.js

# Test production Coolify configuration
NODE_ENV=production node scripts/check_coolify.js
```

## Adding a New Service (e.g. Portfolio Website)

Adding a new service is simple with Traefik. Here's an example for a portfolio website that works in both local and production environments:

```yaml
# In docker-compose.yml
services:
  portfolio:
    image: nginx:alpine  # or any web server image
    container_name: portfolio
    volumes:
      - ./portfolio:/usr/share/nginx/html
    networks:
      - server-net
    labels:
      - "traefik.enable=true"
      # Local development configuration
      - "traefik.http.routers.portfolio-local.rule=Host(`portfolio.localhost`)"
      - "traefik.http.routers.portfolio-local.entrypoints=web"
      - "traefik.http.services.portfolio.loadbalancer.server.port=80"
      
      # Production configuration
      - "traefik.http.routers.portfolio-prod.rule=Host(`portfolio.${DOMAIN:-example.com}`)"
      - "traefik.http.routers.portfolio-prod.entrypoints=web,websecure"
      - "traefik.http.routers.portfolio-prod.tls=true"
      - "traefik.http.routers.portfolio-prod.tls.certresolver=letsencrypt"
```

No need to edit any configuration files or restart proxy servers!

## Security Features

The setup includes several security features:

1. **TLS Configuration**:
   - TLS v1.2+ with modern cipher suites
   - Strong curve preferences for ECDHE
   - SNI strict mode

2. **Security Headers**:
   - Content Security Policy
   - X-Frame-Options (frame deny)
   - X-Content-Type-Options (nosniff)
   - X-XSS-Protection
   - Referrer Policy
   - Permissions Policy
   - Strict Transport Security (HSTS)

3. **Rate Limiting**:
   - Prevents brute force and DoS attacks
   - Configurable limits per client IP

4. **Authentication**:
   - Basic authentication for the dashboard
   - Customizable user/password combinations

## Production Configuration

For production deployments:

1. Make sure your DNS records point to your server:
   - Create A records for each subdomain (coolify, autogen, webui, openhands, traefik)
   - Point them to your server's IP address

2. If using a firewall, ensure these ports are open:
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 8080 (Traefik dashboard - consider restricting access)

3. For enhanced security in production:
   - Enable HTTP to HTTPS redirection by uncommenting the redirection settings in the Traefik configuration
   - Set `--api.insecure=false` and only access the dashboard through HTTPS
   - Update the IP whitelist in the Traefik configuration to restrict dashboard access

## Troubleshooting

- **Service not accessible locally**:
  - Make sure `.localhost` domains resolve to 127.0.0.1 in your hosts file
  - Check that the service container is running with `docker ps`

- **Service not accessible in production**:
  - Verify DNS records are properly set up
  - Check that ports 80/443 are open on your firewall
  - Ensure Let's Encrypt can validate your domain (check Traefik logs)

- **SSL certificate issues**:
  - Check Traefik logs for Let's Encrypt errors
  - Verify email address in the ACME configuration
  - Make sure port 80 is accessible from the internet for HTTP challenge

- **Coolify not working**:
  - Verify the Coolify container is running
  - Check the Coolify logs for any startup errors
  - Make sure the volume mounts are correct

## Additional Resources

- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Traefik & Docker Guide](https://doc.traefik.io/traefik/providers/docker/)
- [Let's Encrypt with Traefik](https://doc.traefik.io/traefik/https/acme/)
- [Coolify Documentation](https://coolify.io/docs)

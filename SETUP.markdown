# Secure Setup Guide for Future-Stack

This guide provides secure instructions for setting up the Future-Stack project without relying on potentially dangerous system-modifying shell scripts.

## Prerequisites

- Docker and Docker Compose installed
- Node.js (version 18 or higher) installed
- Git installed

## Step 1: Environment Configuration

1. Run the secure setup script:

   ```
   npm run setup
   ```

2. Open the generated `.env` file in your preferred text editor and configure your environment variables:
   - Set appropriate database credentials
   - Configure domain settings
   - Set security keys and tokens

   > **IMPORTANT**: Never commit your `.env` file to version control. It contains sensitive information.

## Step 2: Docker Services Configuration

The project uses Docker Compose to orchestrate multiple services. Configuration is handled through:

1. Environment variables (in your `.env` file)
2. Docker Compose files:
   - `docker-compose.yml` - Main services
   - `docker-compose.traefik.yml` - Traefik reverse proxy configuration
   - `docker-compose.rabbitholes.yml` - Rabbit Holes application

Adjust these files only if you need to change the default configuration.

## Step 3: Coolify Integration

Coolify provides a UI for managing your Docker containers. To integrate with Coolify:

1. Make sure Coolify is running:

   ```
   docker-compose -f docker-compose.yml up -d coolify
   ```

2. Access the Coolify dashboard at `http://localhost:8000` (or your configured domain)

3. Follow the on-screen instructions to set up Coolify

4. Import your services using the "Import Existing Resources" option

## Step 4: Traefik Configuration

Traefik is configured through Docker labels in the Docker Compose files. If you need to adjust the Traefik configuration:

1. For domain settings, update the `DOMAIN` variable in your `.env` file

2. For SSL configuration, ensure your domain is pointed to your server's IP address

3. Traefik will automatically obtain SSL certificates via Let's Encrypt

## Security Considerations

- The `.env` file contains sensitive information and should never be committed to Git
- The default configuration uses strong security practices, but you should review it
- Consider setting up a firewall on your server if deploying to a public environment
- Regularly update your containers with `docker-compose pull` followed by `docker-compose up -d`

## Monitoring

The stack includes Grafana and Prometheus for monitoring. Access the Grafana dashboard at:

```
https://grafana.your-domain.com
```

Default credentials are in your `.env` file.

## Troubleshooting

If you encounter issues:

1. Check the logs for specific services:

   ```
   docker-compose logs <service-name>
   ```

2. Ensure all required ports are available on your system

3. Verify your `.env` configuration

4. If Traefik is having issues with SSL, make sure your domain DNS is properly configured

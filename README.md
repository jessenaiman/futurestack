# Future-Stack: Personal Cloud Infrastructure

This project builds a comprehensive personal cloud infrastructure using Docker, Coolify, and Neon PostgreSQL to host development tools, AI services, and web applications.

## Overview

Future-Stack is designed to replace the previous server deployment with a more robust, maintainable infrastructure that features:

- **Coolify** for container orchestration (replacing manual Docker management)
- **Traefik** for reverse proxy and automatic SSL (replacing Nginx)
- **Neon PostgreSQL** with pgvector for centralized database management
- **Comprehensive monitoring** with Grafana and Prometheus

## Quick Start (Secure Setup)

1. Clone this repository
2. Run the secure setup script:

   ```
   npm run setup
   ```

3. Edit the `.env` file with your configuration
4. Start the services:

   ```
   docker-compose up -d
   ```

## Components

The infrastructure includes:

### Core Components

- **Coolify**: Docker orchestration platform
- **Traefik**: Reverse proxy with automatic SSL
- **Neon PostgreSQL**: Cloud database with pgvector extension

### Development Tools

- **OpenProject**: Project management and issue tracking
- **Gitea**: Self-hosted Git service
- **Bolt.new**: Web-based IDE

### AI Services

- **Lobe Chat**: AI chatbot platform
- **Haystack**: AI orchestration framework
- **AutoGen**: Multi-agent AI framework

### Web Applications

- **AstroDB Sites**: Portfolio, documentation, and other websites
- **Rabbit Holes**: Knowledge management tool
- **Foundry VTT**: Virtual tabletop platform

### Support Services

- **Nextcloud**: File sharing and collaboration
- **Email Stack**: Postfix, Dovecot, Roundcube

## Architecture

The system follows a layered architecture approach:

1. **Edge Layer**: Traefik, Let's Encrypt SSL, Fail2ban
2. **Orchestration Layer**: Coolify, Docker
3. **Application Layer**: Development tools, AI services, web applications
4. **Data Layer**: Neon PostgreSQL, pgvector
5. **Monitoring Layer**: Grafana, Prometheus

Detailed architecture diagrams are available in the `docs/` directory.

## Documentation

- **[SETUP.markdown](SETUP.markdown)**: Step-by-step setup instructions
- **[TASKS.markdown](TASKS.markdown)**: Detailed task list with GitHub issue references
- **[docs/target-architecture.md](docs/target-architecture.md)**: Target architecture diagrams
- **[docs/migration-strategy.md](docs/migration-strategy.md)**: Migration plan from current to target architecture
- **[docs/architecture-comparison.md](docs/architecture-comparison.md)**: Comparison between current and target architectures

## Getting Started

Follow the instructions in [SETUP.markdown](SETUP.markdown) to deploy the infrastructure, or check individual GitHub issues for specific component deployments.

## Migration

This project represents a migration from the previous server setup (manual Docker with Nginx) to a more maintainable architecture (Coolify with Traefik). The migration strategy is detailed in [docs/migration-strategy.md](docs/migration-strategy.md).

## Contributing

Contributions are welcome! Please create a GitHub issue for any bugs or feature requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

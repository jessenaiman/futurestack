# Docker Compose & MCP/LLM/AI Tools: Latest Features & Best Practices (2024)

## Docker Compose New Features (2024)
- **`include:`**: Compose files can now include other Compose files, supporting modular and team-based development. Example:
  ```yaml
  include:
    - team-1/compose.yaml
    - team-2/compose.yaml
  ```
- **Profiles**: Use `profiles` to control which services are started by default or for specific environments (dev, test, prod).
- **Secrets**: Native support for secrets in Compose, both for runtime and build-time. Example:
  ```yaml
  secrets:
    my_secret:
      file: ./my_secret.txt
  ```
- **Extensions (`x-` fields)**: Custom fields for advanced configuration and DRY patterns.
- **Develop/Watch**: The `develop.watch` feature enables live code reloads and rebuilds for rapid development.
- **Override/Local Customization**: Use override files to customize third-party or included Compose files without modifying the original.

## MCP, LLM, and AI Tools in Docker
- **MCP (Model Context Protocol)**: Many AI/LLM tools now provide Docker images that run as MCP servers, allowing seamless integration and orchestration.
- **Best Practice**: Use Docker Compose to orchestrate MCP servers and AI tools, passing secrets and API keys via Docker secrets or environment variables.
- **Example MCP Server Config (JSON):**
  ```json
  {
    "mcpServers": {
      "puppeteer": {
        "command": "docker",
        "args": ["run", "-i", "--rm", "-e", "DOCKER_CONTAINER", "mcp/puppeteer"],
        "env": {"DOCKER_CONTAINER": "true"}
      }
    }
  }
  ```
- **AI Tool Discovery**: The `labs-ai-tools-for-devs` repo provides a catalog of Dockerized AI tools, many supporting MCP out of the box.

## Best Practices
- Centralize secrets and environment variables using Docker secrets and a root `.env` file.
- Use `include:` and override files for modular, maintainable Compose setups.
- Use `profiles` to control which services are started in different environments.
- Always follow official documentation for each service.
- Secure all endpoints, especially those exposing LLM or paid API access.
- Monitor and audit container logs and network access.

---
This note is for future reference and onboarding. Ask for this note in a new context to get up to speed on Docker Compose, MCP, and AI tool orchestration as of 2024.

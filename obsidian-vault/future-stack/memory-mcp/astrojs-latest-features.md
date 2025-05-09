# Astro.js v5 (2024) - Latest Features, Best Practices, and Docker Setup

## Official Documentation
- Main: https://docs.astro.build/en/getting-started/
- Project: https://astro.build/
- GitHub: https://github.com/withastro/astro

## Key Features (2024)
- **Astro Actions**: Type-safe backend functions callable from the frontend.
- **Server Islands**: Server-rendered components embedded in static pages for performance and flexibility.
- **Content Layer API**: Flexible content loading from local files, APIs, or databases.
- **Astro DB**: Built-in database support (libSQL, Turso, etc.).
- **astro:env**: Type-safe, context-aware environment variable management.
- **Request Rewriting**: Serve different routes without client-side redirects.
- **Container API**: Render Astro components in isolation (experimental).
- **Sessions**: Native session management (experimental in v5.1).
- **Responsive Images**: Experimental support for automated srcset/sizes.
- **Starlight**: Official documentation theme with SSR support.

## Project Setup & Best Practices
- Use `npm create astro@latest` for the latest starter.
- Define env schema in `astro.config.mjs` with `envField` for type safety.
- Use `.env` for secrets and `PUBLIC_` prefix for client-exposed vars.
- Multi-stage Docker builds for SSR/static sites (Node, Apache, NGINX supported).
- Use `astro:env/client` and `astro:env/server` for context-specific env vars.
- Use `--mode` flag for environment-specific builds (e.g., staging, prod).

## Docker Example (SSR)
```dockerfile
FROM node:lts AS runtime
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs
```

## Environment Variables Example
```js
import { defineConfig, envField } from "astro/config";
export default defineConfig({
  env: {
    schema: {
      API_URL: envField.string({ context: "client", access: "public", optional: true }),
      PORT: envField.number({ context: "server", access: "public", default: 4321 }),
      API_SECRET: envField.string({ context: "server", access: "secret" })
    }
  }
})
```

## References
- [Astro Docs](https://docs.astro.build/en/getting-started/)
- [Astro Docker Recipes](https://docs.astro.build/en/recipes/docker/)
- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/)

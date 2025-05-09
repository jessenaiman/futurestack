# MCP Tools Documentation

## desktop-commander

Advanced terminal and file system control tool that provides:

- File management capabilities:
  - File system search and navigation
  - File content search and replace
  - File diff editing
  - Batch file operations
- Terminal command execution:
  - Long-running process management
  - Command output streaming
  - Process control (start/stop/restart)

## github

Handles GitHub tasks: issues, pull requests, code reviews, repository, and commits.

## context7 (<https://context7.com/>)

<https://github.com/upstash/context7>a

Fetches documentation: GitHub, libraries, SDKs with real-time updates and cross-references.

## obsidian

Manages knowledge: team docs, Kanban, notes, file operations, and vault.

## tavily

Advanced web search capabilities:

- AI-powered search results
- Content extraction
- Real-time web information retrieval
- Domain-specific searching
- Customizable search parameters:
  - Result count control
  - Time range filtering
  - Content type filtering

## playwright

Browser automation toolkit providing:

🌐 Browser Control:

- Multi-browser support
- Page navigation
- DOM manipulation
- Network monitoring

📸 Visual Testing:

- Full page screenshots
- Element capture
- Visual comparison

🖱️ Interaction Automation:

- Click simulation
- Form filling
- Keyboard input
- Drag and drop

📊 Debugging Tools:

- Console logging
- Network request tracking
- Performance monitoring

🔧 Advanced Features:

- File upload handling
- Dialog management
- Multiple tab control
- Custom JavaScript execution

## coolify

<https://github.com/coollabsio/coolify>
<https://github.com/coollabsio/coolify-docs>
<https://github.com/coollabsio/coolify-examples>
<https://github.com/coollabsio/coolify-cli>

Infrastructure and deployment management system:

🔄 Resource Management:

- List and manage resources
- Application deployment
- Service orchestration
- Database management
- Real-time deployment tracking

🚀 Application Operations:

- Start/Stop/Restart applications
- Health check configuration
- Domain management
- Environment variable handling
- Automatic deployment triggers

🛠️ Service Integration:

- RabbitHoles deployment
- Multi-service orchestration
- Project configuration
- Branch management
- Deployment history tracking

⚙️ Infrastructure Control:

- Docker host management
- Build pack configuration
- Environment setup
- SSL/TLS certificate handling
- Health monitoring

# Tool Parameters and Usage

## desktop-commander

```json
{
  "command": "<command>",        // Command to execute
  "cwd": "<working-directory>",  // Optional: Working directory
  "env": {},                     // Optional: Environment variables
  "shell": true|false           // Optional: Run in shell
}
```

## github

```json
{
  "owner": "string",           // Required: Repository owner
  "repo": "string",            // Required: Repository name
  "issue_number": number,      // Required for issues
  "body": "string"            // Required: Content for comments/PRs
}
```

## context7

```json
{
  "libraryName": "string",     // Required: Package/library name
  "context7CompatibleLibraryID": "string"  // Required for docs
}
```

## obsidian

```json
{
  "filepath": "string",        // Required: Path relative to vault
  "query": "string",          // Required for search
  "content": "string",        // Required for content operations
  "period": "daily|weekly|monthly|quarterly|yearly"  // For periodic notes
}
```

## tavily

```json
{
  "query": "string",          // Required: Search query
  "max_results": number,      // Optional: Default 10
  "search_depth": "basic|advanced",  // Optional: Default "basic"
  "topic": "general|news"     // Optional: Default "general"
}
```

## playwright

```json
{
  "element": "string",        // Required: Element description
  "ref": "string",           // Required: Element reference
  "url": "string",           // Required for navigation
  "command": "string",       // Required for actions
  "isBackground": boolean    // Optional: For long-running operations
}
```

## coolify

```json
{
  "uuid": "string",          // Required: Resource UUID
  "projectId": "string",     // Required: Project identifier
  "settings": {},           // Optional: Configuration object
  "force": boolean,         // Optional: Force rebuild
  "tag": "string"          // Optional: Deployment tag
}
```

# Common Patterns

## Error Handling

Tools: Detailed messages, retries, codes, resource cleanup.

## Authentication

Tools: Env variables, token auth, session handling, secure storage.

## Streaming

Tools: Progress updates, cancellation, timeouts, buffering.

# Best Practices for Tool Usage

## Tool Combinations

### Development Workflow

1. Use `context7` + `github` for:
   - Code research and documentation
   - Pull request reviews
   - Issue management
   - Code change validation

2. Use `desktop-commander` + `playwright` for:
   - Automated testing
   - UI verification
   - Integration testing
   - Performance monitoring

3. Use `neon` + `coolify` for:
   - Database deployments
   - Schema migrations
   - Application updates
   - Infrastructure management

### Documentation Workflow

1. Use `obsidian` + `tavily` for:
   - Knowledge base updates
   - Research documentation
   - Technical writing
   - Reference management

## Performance Optimization

- Parallel: Group calls, use background processes, handle errors.
- Resource: Clean sessions, close connections, manage handles.
- Caching: Cache results, store queries, invalidate properly.

## Security Considerations

- Credentials: Use env vars, rotate tokens, least privilege.
- Input: Sanitize inputs, validate paths, check permissions.
- Output: Sanitize outputs, handle sensitive info, proper logging.

## Monitoring and Debugging

- Logging: Use log levels, include context, error tracking.
- Performance: Track times, monitor usage, implement alerting.
- Error: Retry mechanisms, handle failures, provide messages.

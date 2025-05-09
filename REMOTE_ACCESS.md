# Remote Access Guide for AI Services

This guide explains how to access the hosted AI services (AutoGen Studio, Open WebUI, and All-Hands) from other devices on your network.

## Connection Information

The server hosting these services is available at IP address: **192.168.0.61**

| Service | URL (Local Network) | Direct Port Access |
|---------|---------------------|-------------------|
| AutoGen Studio | https://192.168.0.61 or https://autogen.192.168.0.61 | N/A |
| Open WebUI | https://192.168.0.61 or https://webui.192.168.0.61 | http://192.168.0.61:3000 |
| All-Hands | https://192.168.0.61 or https://openhands.192.168.0.61 | N/A |

## Accessing the Services

### Method 1: Using IP Address Directly

You can access the services by visiting:
- https://192.168.0.61 (will be routed to AutoGen Studio by default)
- https://192.168.0.61:3000 (direct access to Open WebUI)

### Method 2: Using Domain-Style Naming

For a better user experience with domain-style URLs, add these entries to your client device's hosts file:

```
192.168.0.61  autogen.192.168.0.61
192.168.0.61  webui.192.168.0.61
192.168.0.61  openhands.192.168.0.61
```

#### Hosts File Location:
- **Windows**: `C:\Windows\System32\drivers\etc\hosts`
- **Mac/Linux**: `/etc/hosts`

After adding these entries, you can use:
- https://autogen.192.168.0.61
- https://webui.192.168.0.61
- https://openhands.192.168.0.61

## Handling Security Warnings

When accessing the services via HTTPS, you'll receive security warnings because we're using self-signed SSL certificates for local development. This is expected and can be safely bypassed for local network use.

To bypass these warnings:
- Chrome: Click "Advanced" and then "Proceed to [site] (unsafe)"
- Firefox: Click "Advanced" → "Accept the Risk and Continue"
- Safari: Click "Show Details" → "visit this website"

## Feature Verification Checklist

After connecting to each service, verify these key features:

### AutoGen Studio
- [ ] Agent creation and configuration
- [ ] Group chat functionality
- [ ] Built-in tools and capabilities

### Open WebUI
- [ ] Model loading and communication with Ollama
- [ ] Chat interface functionality
- [ ] File uploading and RAG capabilities

### All-Hands
- [ ] Project creation and management
- [ ] Agent interactions
- [ ] Integration with supported tools

## Troubleshooting

1. **Cannot connect to services**:
   - Verify the server is running: `docker ps`
   - Check firewall settings: Ensure ports 80 and 443 are open
   - Restart Nginx: `docker restart nginx-proxy`

2. **SSL Certificate Errors**:
   - Expected behavior with self-signed certificates
   - Follow browser-specific steps to bypass

3. **Service not loading**:
   - Check service container status: `docker logs [container-name]`
   - Verify all containers are running: `docker ps`
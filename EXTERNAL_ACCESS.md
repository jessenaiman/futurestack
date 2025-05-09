# External Remote Access Guide

This guide provides step-by-step instructions for making your AI services (Open WebUI and All-Hands) accessible from outside your local network, such as from a remote office.

## Prerequisites

- A server running Docker with your services deployed
- Administrative access to your network router
- Optionally, a domain name (either a custom domain or a free dynamic DNS service)

## Step 1: Configure Port Forwarding on Your Router

1. Access your router's admin interface (typically <http://192.168.0.1> or <http://192.168.1.1>)
2. Login with your router's admin credentials
3. Navigate to the "Port Forwarding" or "Virtual Server" section
4. Add port forwarding rules:
   - Forward external port 80 to 192.168.0.61:80 (HTTP)
   - Forward external port 443 to 192.168.0.61:443 (HTTPS)
5. Save your changes and restart the router if required

## Step 2: Set Up Domain Name (Choose One Option)

### Option A: Free Dynamic DNS Service

1. Sign up for a free dynamic DNS service:
   - [DuckDNS](https://www.duckdns.org/)
   - [No-IP](https://www.noip.com/)
   - [FreeDNS](https://freedns.afraid.org/)
2. Create a subdomain (e.g., `yourname.duckdns.org`)
3. Install the dynamic DNS client on your server:

   ```bash
   # Example for Duck DNS
   mkdir -p ~/duckdns
   cd ~/duckdns
   echo "echo url=\"https://www.duckdns.org/update?domains=YOURDOMAIN&token=YOURTOKEN&ip=\" | curl -k -o ~/duckdns/duck.log -K -" > duck.sh
   chmod 700 duck.sh
   
   # Add to crontab to run every 5 minutes
   (crontab -l 2>/dev/null; echo "*/5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1") | crontab -
   ```

### Option B: Custom Domain

1. Register a domain through a domain registrar (Namecheap, Google Domains, etc.)
2. Set up DNS A records:
   - Point `your-domain.com` to your public IP address
   - Add subdomains: `webui.your-domain.com`, `openhands.your-domain.com`
3. Find your public IP address using: `curl -4 ifconfig.me`

## Step 3: Obtain SSL Certificates for Your Domain

Our configuration is already set up to use SSL certificates. For development, we're using self-signed certificates, but for production, you should use Let's Encrypt:

1. SSH into your server
2. Run the included script:

   ```bash
   sudo ./scripts/setup_ssl_certificates.sh your-domain.com webui.your-domain.com openhands.your-domain.com
   ```

## Step 4: Update Environment Variables

If you're using real domain names, update your environment values:

1. Edit the environment configuration in your docker-compose.yml file:

   ```
   environment:
     - WEBUI_URL=https://webui.your-domain.com
   ```

2. Restart the services:

   ```bash
   docker-compose down
   docker-compose up -d
   ```

## Step 5: Verify External Access

1. From a device outside your local network (e.g., using mobile data or from your remote office):
   - Visit `https://webui.your-domain.com`
   - Visit `https://openhands.your-domain.com`

2. Test key functionality for each service:
   - **Open WebUI**: Load models, test chat interface, try RAG capabilities
   - **All-Hands**: Create projects, test agent interactions

## Security Considerations

When exposing services to the internet, security becomes critical:

1. **Use Strong Passwords**: Ensure your services have strong authentication
2. **Keep Updated**: Regularly update Docker images and dependencies
3. **Firewall Rules**: Consider restricting access by IP if possible
4. **Monitor Logs**: Check Nginx logs regularly for suspicious activity
5. **Regular Backups**: Backup your data periodically

## Troubleshooting

1. **Cannot Access Services Externally**:
   - Verify port forwarding is correctly set up
   - Check if your ISP blocks ports 80/443
   - Test if your public IP has changed

2. **SSL Certificate Errors**:
   - Ensure your Let's Encrypt certificates are properly installed
   - Check certificate expiration dates

3. **Services Running Slowly**:
   - Consider your home internet upload speed limitations
   - Check if your server has sufficient resources

## Advanced Setup: Using a VPN

For enhanced security, consider using a VPN instead of direct exposure:

1. Set up a VPN server like WireGuard on your home network
2. Connect to your VPN from your remote location
3. Access services via local addresses without exposing them to the internet

This approach offers better security but requires additional setup.

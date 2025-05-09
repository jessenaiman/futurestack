#!/bin/bash
# Production Security Test Script
# Tests security setup by checking configurations and running basic security checks

set -e

echo "Running security tests for Future-Stack production environment..."
echo "==============================================================="

# Create log directory
mkdir -p /tmp/security-test-logs

# Test 1: Check UFW status
echo "Test 1: Checking UFW status..."
if ufw status | grep -q "Status: active"; then
  echo "✅ UFW is active"
  echo "UFW Rules:"
  ufw status | grep -v "Status" | grep -v "To" | grep -v "--" | grep -v "^$"
else
  echo "❌ UFW is not active"
fi

# Test 2: Check Traefik SSL configuration
echo -e "\nTest 2: Checking Traefik SSL configuration..."
if [ -f "/data/coolify/services/traefik/acme/acme.json" ]; then
  PERMISSION=$(stat -c "%a" /data/coolify/services/traefik/acme/acme.json)
  if [ "$PERMISSION" = "600" ]; then
    echo "✅ Traefik acme.json exists with correct permissions (600)"
  else
    echo "❌ Traefik acme.json has incorrect permissions: $PERMISSION (should be 600)"
  fi
else
  echo "❌ Traefik acme.json not found"
fi

# Test 3: Check Fail2ban status
echo -e "\nTest 3: Checking Fail2ban status..."
if docker ps | grep -q "fail2ban"; then
  echo "✅ Fail2ban container is running"
  # Check if Fail2ban is functioning
  docker exec fail2ban fail2ban-client status > /tmp/security-test-logs/fail2ban-status.log 2>&1
  if [ $? -eq 0 ]; then
    echo "✅ Fail2ban service is functioning properly"
    echo "Active jails:"
    docker exec fail2ban fail2ban-client status | grep "Jail list" | sed 's/.*Jail list:\s*//'
  else
    echo "❌ Fail2ban service is not functioning properly"
  fi
else
  echo "❌ Fail2ban container is not running"
fi

# Test 4: Check for common security misconfigurations
echo -e "\nTest 4: Checking for common security misconfigurations..."

# Check for exposed ports
echo "Scanning for unnecessarily exposed ports..."
EXPOSED_PORTS=$(netstat -tulnp | grep LISTEN | grep -v "127.0.0.1")
echo "$EXPOSED_PORTS" > /tmp/security-test-logs/exposed-ports.log
if echo "$EXPOSED_PORTS" | grep -qE ":(8080|8443)"; then
  echo "⚠️ Warning: Admin ports may be exposed to the internet" 
  echo "Details saved to /tmp/security-test-logs/exposed-ports.log"
else
  echo "✅ No sensitive admin ports exposed to the internet"
fi

# Test 5: Check TLS version and ciphers
echo -e "\nTest 5: Checking TLS configuration..."
if command -v nmap &> /dev/null; then
  echo "Using nmap to check SSL/TLS configuration on port 443..."
  nmap --script ssl-enum-ciphers -p 443 localhost > /tmp/security-test-logs/tls-check.log 2>&1
  if grep -q "TLSv1.0\|TLSv1.1\|SSLv2\|SSLv3" /tmp/security-test-logs/tls-check.log; then
    echo "❌ Insecure TLS/SSL protocols detected"
    grep -A15 "TLS\|SSL" /tmp/security-test-logs/tls-check.log
  else
    echo "✅ Only secure TLS protocols detected"
  fi
else
  echo "⚠️ nmap not installed. Skipping TLS check."
  echo "Install with: apt-get install -y nmap"
fi

# Test 6: Check security headers
echo -e "\nTest 6: Checking security headers..."
if command -v curl &> /dev/null; then
  echo "Testing security headers on localhost..."
  curl -s -I -X GET https://localhost -k > /tmp/security-test-logs/headers.log 2>&1
  HEADER_COUNT=0
  EXPECTED_HEADERS=("Strict-Transport-Security" "X-Content-Type-Options" "X-Frame-Options" "Content-Security-Policy")
  
  for header in "${EXPECTED_HEADERS[@]}"; do
    if grep -qi "$header" /tmp/security-test-logs/headers.log; then
      echo "✅ $header header is set"
      ((HEADER_COUNT++))
    else
      echo "❌ $header header is missing"
    fi
  done
  
  if [ $HEADER_COUNT -eq ${#EXPECTED_HEADERS[@]} ]; then
    echo "✅ All security headers are properly configured"
  else
    echo "❌ Some security headers are missing"
  fi
else
  echo "⚠️ curl not installed. Skipping security headers check."
fi

echo -e "\nSecurity tests completed. Results and logs saved to /tmp/security-test-logs/"
echo "Review the logs for detailed information about potential security issues."
echo "==============================================================="

# Summary
echo -e "\nSecurity Test Summary:"
echo "1. UFW Firewall: $(ufw status | grep -q "Status: active" && echo "PASS" || echo "FAIL")"
echo "2. Traefik SSL: $([ -f "/data/coolify/services/traefik/acme/acme.json" ] && [ "$(stat -c "%a" /data/coolify/services/traefik/acme/acme.json)" = "600" ] && echo "PASS" || echo "FAIL")"
echo "3. Fail2ban: $(docker ps | grep -q "fail2ban" && echo "PASS" || echo "FAIL")"
echo "4. Exposed Ports: $(echo "$EXPOSED_PORTS" | grep -qE ":(8080|8443)" && echo "WARNING" || echo "PASS")"
echo "5. TLS Configuration: $(grep -q "TLSv1.0\|TLSv1.1\|SSLv2\|SSLv3" /tmp/security-test-logs/tls-check.log 2>/dev/null && echo "FAIL" || echo "PASS")"
echo "6. Security Headers: $([ $HEADER_COUNT -eq ${#EXPECTED_HEADERS[@]} ] 2>/dev/null && echo "PASS" || echo "FAIL/UNKNOWN")"
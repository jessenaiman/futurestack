#!/bin/bash

# ==========================================
#  Future-Stack Docker Deployment Manager
# ==========================================
# This script starts all services in your unified stack using Docker Compose.
# It prunes unused Docker resources, starts each service group in order,
# and logs all output to stack_deploy.log (also shown in the terminal).
#
# Usage:
#   chmod +x start_stack.sh
#   ./start_stack.sh
# ==========================================

set -euo pipefail

LOGFILE="stack_deploy.log"
: > "$LOGFILE"

function log_section() {
  echo -e "\n========================================" | tee -a "$LOGFILE"
  echo "$1" | tee -a "$LOGFILE"
}

echo "Pruning Docker system..." | tee -a "$LOGFILE"
docker system prune -f | tee -a "$LOGFILE"

declare -a compose_files=(
  "docker_servers/docker-compose.base.yml"
  "docker_servers/docker-compose.prometheus.yml"
  "docker_servers/docker-compose.grafana.yml"
  "docker_servers/docker-compose.portainer.yml"
  "docker_servers/docker-compose.openwebui.yml"
  "docker_servers/docker-compose.openhands.yml"
  "docker_servers/docker-compose.status-astro.yml"
  "docker_servers/docker-compose.rabbitholes.yml"
  "docker_servers/testing/docker-compose.testing.yml"
)

declare -a group_names=(
  "Core Services (Traefik, PostgreSQL, MinIO)"
  "Prometheus"
  "Grafana"
  "Portainer"
  "Open-WebUI and Dependencies"
  "OpenHands"
  "Status Page"
  "Rabbit Holes"
  "Testing Services (Puppeteer, Playwright)"
)

for i in "${!compose_files[@]}"; do
  file="${compose_files[$i]}"
  group="${group_names[$i]}"
  log_section "Starting $group with $file..."
  docker-compose -f "$file" up -d | tee -a "$LOGFILE"
  echo "Done: $group" | tee -a "$LOGFILE"
done

log_section "Checking running containers..."
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" | tee -a "$LOGFILE"

echo -e "\nStack deployment complete. See $LOGFILE for details." 
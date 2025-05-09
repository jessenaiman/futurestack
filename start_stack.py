#!/usr/bin/env python3

import sys
import subprocess
import time
import os
from typing import List, Tuple
try:
    from colorama import init, Fore, Style
    from tabulate import tabulate
except ImportError:
    print('Required libraries not found. Installing...')
    subprocess.run([sys.executable, '-m', 'pip', 'install', 'colorama', 'tabulate'], check=True)
    from colorama import init, Fore, Style
    from tabulate import tabulate

# Initialize colorama for colored output
init()

# Check for virtual environment
if not os.environ.get('VIRTUAL_ENV'):
    print(f"{Fore.YELLOW}Warning: Virtual environment not detected. It's recommended to run this script in a virtual environment.{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}To set up a virtual environment, run: python -m venv venv && source venv/bin/activate (Linux/Mac) or venv\Scripts\activate (Windows){Style.RESET_ALL}")
    print()

# Service information for display
SERVICES = [
    {'name': 'Traefik', 'role': 'Reverse Proxy', 'desc': 'Routes traffic to all services with TLS support', 'github': 'https://github.com/traefik/traefik', 'file': 'docker_servers/docker-compose.base.yml'},
    {'name': 'MinIO', 'role': 'Object Storage', 'desc': 'S3-compatible storage for files and backups', 'github': 'https://github.com/minio/minio', 'file': 'docker_servers/docker-compose.base.yml'},
    {'name': 'PostgreSQL', 'role': 'Database', 'desc': 'Relational DB with pgvector for AI embeddings', 'github': 'https://github.com/ankane/pgvector', 'file': 'docker_servers/docker-compose.base.yml'},
    {'name': 'Open-WebUI', 'role': 'AI Interface', 'desc': 'User-friendly interface for LLM interactions', 'github': 'https://github.com/open-webui/open-webui', 'file': 'docker_servers/docker-compose.openwebui.yml'},
    {'name': 'Rabbit Holes', 'role': 'Research Tool', 'desc': 'Tool for deep research and data exploration', 'github': 'https://github.com/rabbitholes/rabbitholes', 'file': 'docker_servers/docker-compose.rabbitholes.yml'},
    {'name': 'OpenHands', 'role': 'AI Coding Assistant', 'desc': 'Assists with coding tasks using AI models', 'github': 'https://github.com/All-Hands-AI/OpenHands', 'file': 'docker_servers/docker-compose.openhands.yml'},
    {'name': 'Status Page (Astro)', 'role': 'Service Dashboard', 'desc': 'Central hub to access all web services', 'github': 'https://github.com/withastro/astro', 'file': 'docker_servers/docker-compose.status-astro.yml'},
    {'name': 'Prometheus', 'role': 'Monitoring', 'desc': 'Collects metrics for system performance', 'github': 'https://github.com/prometheus/prometheus', 'file': 'docker_servers/docker-compose.prometheus.yml'},
    {'name': 'Grafana', 'role': 'Visualization', 'desc': 'Dashboards for monitoring data visualization', 'github': 'https://github.com/grafana/grafana', 'file': 'docker_servers/docker-compose.grafana.yml'},
    {'name': 'Portainer', 'role': 'Docker Management', 'desc': 'UI for managing containers and ports', 'github': 'https://github.com/portainer/portainer', 'file': 'docker_servers/docker-compose.portainer.yml'}
]

# Group services by Compose file for efficient startup
COMPOSE_FILES = [
    ('docker_servers/docker-compose.base.yml', 'Core Services (Traefik, MinIO, PostgreSQL)'),
    ('docker_servers/docker-compose.openwebui.yml', 'Open-WebUI and Dependencies'),
    ('docker_servers/docker-compose.rabbitholes.yml', 'Rabbit Holes'),
    ('docker_servers/docker-compose.openhands.yml', 'OpenHands'),
    ('docker_servers/docker-compose.status-astro.yml', 'Status Page'),
    ('docker_servers/docker-compose.prometheus.yml', 'Prometheus'),
    ('docker_servers/docker-compose.grafana.yml', 'Grafana'),
    ('docker_servers/docker-compose.portainer.yml', 'Portainer')
]

def display_welcome():
    """Display a professional welcome message."""
    print(f"{Fore.CYAN}{Style.BRIGHT}==========================================")
    print(f" Future-Stack Docker Deployment Manager")
    print(f"=========================================={Style.RESET_ALL}")
    print(f"{Fore.YELLOW}This script will start all services in your unified stack.")
    print(f"Each service will be displayed with its role and GitHub link.{Style.RESET_ALL}")
    print()

def display_services(services: List[dict]):
    """Display service information in a formatted table."""
    table_data = [[s['name'], s['role'], s['desc'], s['github']] for s in services]
    headers = ['Service', 'Role', 'Description', 'GitHub Repository']
    print(tabulate(table_data, headers=headers, tablefmt='fancy_grid'))
    print()

def run_command(command: List[str], error_msg: str) -> Tuple[bool, str]:
    """Run a shell command and return success status and output."""
    try:
        result = subprocess.run(command, shell=False, check=True, text=True, capture_output=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, f"{error_msg}: {e.stderr}"

def start_service_group(compose_file: str, group_name: str):
    """Start services for a specific Docker Compose file."""
    print(f"{Fore.CYAN}{Style.BRIGHT}Starting {group_name} with {compose_file}...{Style.RESET_ALL}")
    success, output = run_command(['docker-compose', '-f', compose_file, 'up', '-d'], f"Failed to start {group_name}")
    if success:
        print(f"{Fore.GREEN}✓ Successfully started {group_name}{Style.RESET_ALL}")
    else:
        print(f"{Fore.RED}✗ Error starting {group_name}{Style.RESET_ALL}")
        print(f"{Fore.RED}{output}{Style.RESET_ALL}")
    print()
    time.sleep(5)  # Delay to ensure services initialize
    return success

def check_running_containers():
    """Check and display running containers."""
    print(f"{Fore.CYAN}{Style.BRIGHT}Checking running containers...{Style.RESET_ALL}")
    success, output = run_command(['docker', 'ps', '--format', 'table {{.Names}}	{{.Image}}	{{.Status}}	{{.Ports}}'], "Failed to list containers")
    if success:
        print(f"{Fore.GREEN}✓ Running Containers:{Style.RESET_ALL}")
        print(output)
    else:
        print(f"{Fore.RED}✗ Error listing containers{Style.RESET_ALL}")
        print(f"{Fore.RED}{output}{Style.RESET_ALL}")
    print()

def main():
    """Main function to orchestrate the stack startup."""
    display_welcome()
    print(f"{Fore.YELLOW}Services to be started:{Style.RESET_ALL}")
    display_services(SERVICES)
    
    all_successful = True
    for compose_file, group_name in COMPOSE_FILES:
        if not start_service_group(compose_file, group_name):
            all_successful = False
    
    if all_successful:
        print(f"{Fore.GREEN}{Style.BRIGHT}All services started successfully!{Style.RESET_ALL}")
    else:
        print(f"{Fore.RED}{Style.BRIGHT}Some services failed to start. Check errors above.{Style.RESET_ALL}")
    
    check_running_containers()
    print(f"{Fore.CYAN}{Style.BRIGHT}Deployment complete. Access your status page at http://status.localhost:4321 or as configured.{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}Note: To run end-to-end tests for services, use the Playwright test suite located in the 'e2e' folder.{Style.RESET_ALL}")
    print(f"{Fore.YELLOW}Run 'npx playwright test' from the 'e2e' directory to execute the tests after services are up.{Style.RESET_ALL}")

if __name__ == '__main__':
    main() 
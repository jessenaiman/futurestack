#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// List of potentially dangerous script files
const dangerousScripts = [
    'fix_dns_security.sh',
    'generate_certificates.sh',
    'generate_traefik_certs.sh',
    'implement_security.sh',
    'setup_fail2ban.sh',
    'setup_local_dns.sh',
    'setup_ssl_certificates.sh',
    'setup_traefik_security.sh',
    'setup_ufw_firewall.sh',
    'switch_proxy.sh',
    'switch_to_traefik.sh',
    'update_duckdns.sh',
    'update_hosts.sh'
];

// Path to the scripts directory
const scriptsDir = path.join(process.cwd(), 'scripts');

// Create a backup directory for the scripts
const backupDir = path.join(process.cwd(), 'scripts_backup');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

// Move dangerous scripts to the backup directory
dangerousScripts.forEach(scriptName => {
    const scriptPath = path.join(scriptsDir, scriptName);
    const backupPath = path.join(backupDir, scriptName);

    if (fs.existsSync(scriptPath)) {
        console.log(`Moving potentially dangerous script: ${scriptName} to backup`);
        fs.renameSync(scriptPath, backupPath);
    }
});

console.log('Dangerous scripts have been backed up and removed from the scripts directory.');
console.log('They are now in the scripts_backup directory, which is excluded from Git via .gitignore.');

// Make sure the backup directory is added to .gitignore
const gitignorePath = path.join(process.cwd(), '.gitignore');
let gitignoreContent = '';

if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
}

if (!gitignoreContent.includes('scripts_backup/')) {
    console.log('Adding scripts_backup/ to .gitignore');
    fs.appendFileSync(gitignorePath, '\n# Backup of potentially dangerous scripts\nscripts_backup/\n');
}

console.log('Script cleanup complete.');
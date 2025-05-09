#!/bin/bash
# Script to backup Coolify environment variables
# Add to crontab with: 0 0 * * * /home/dicewizard/projects/future-stack/scripts/backup_coolify_env.sh

# Configuration
BACKUP_DIR="/home/dicewizard/projects/future-stack/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SOURCE_ENV="/data/coolify/source/.env"
BACKUP_FILE="${BACKUP_DIR}/coolify_env_backup_${TIMESTAMP}.env"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create the backup
echo "Backing up Coolify environment variables..."
cp $SOURCE_ENV $BACKUP_FILE

# Set secure permissions
chmod 600 $BACKUP_FILE

# Keep only the 5 most recent backups
echo "Cleaning up old backups..."
ls -tp $BACKUP_DIR/coolify_env_backup_* | grep -v '/$' | tail -n +6 | xargs -I {} rm -- {}

echo "Backup completed successfully: $BACKUP_FILE"
#!/bin/bash
# Backup script for server deployment data

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/server_backup_${TIMESTAMP}.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "Starting backup process at $(date)"

# Backup Autogen data
echo "Backing up Autogen data..."
tar -czf "${BACKUP_DIR}/autogen_${TIMESTAMP}.tar.gz" ./autogen/data

# Backup OpenWebUI data
echo "Backing up OpenWebUI data..."
tar -czf "${BACKUP_DIR}/openwebui_${TIMESTAMP}.tar.gz" ./open-webui/data

# Backup All-Hands data
echo "Backing up All-Hands data..."
tar -czf "${BACKUP_DIR}/all-hands_${TIMESTAMP}.tar.gz" ./all-hands/data

# Create a combined backup
echo "Creating combined backup..."
tar -czf $BACKUP_FILE \
    "${BACKUP_DIR}/autogen_${TIMESTAMP}.tar.gz" \
    "${BACKUP_DIR}/openwebui_${TIMESTAMP}.tar.gz" \
    "${BACKUP_DIR}/all-hands_${TIMESTAMP}.tar.gz"

# Clean up individual backups
rm "${BACKUP_DIR}/autogen_${TIMESTAMP}.tar.gz"
rm "${BACKUP_DIR}/openwebui_${TIMESTAMP}.tar.gz"
rm "${BACKUP_DIR}/all-hands_${TIMESTAMP}.tar.gz"

echo "Backup completed successfully: $BACKUP_FILE"
echo "Backup size: $(du -h $BACKUP_FILE | cut -f1)"

# Optional: keep only last 5 backups
echo "Cleaning up old backups..."
ls -tp $BACKUP_DIR/server_backup_* | grep -v '/$' | tail -n +6 | xargs -I {} rm -- {}

echo "Backup process completed at $(date)"
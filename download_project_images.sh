#!/bin/bash

# PocketBase Project Image Downloader
# This script downloads all images from the 'projects' collection on https://database.zulfikar.site
# and saves them as {project-name}.{extension} in a local folder.

BASE_URL="https://database.zulfikar.site"
COLLECTION="projects"
OUTPUT_DIR="project_images"
TOKEN=""

# Usage info
usage() {
    echo "Usage: $0 [email] [password]"
    echo "If credentials are provided, it will authenticate as a superuser (admin)."
    echo "Otherwise, it will attempt to fetch publicly accessible records."
}

# Authenticate if credentials are provided
if [ "$#" -eq 2 ]; then
    EMAIL=$1
    PASSWORD=$2
    echo "Authenticating as $EMAIL..."
    AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admins/auth-with-password" \
        -H "Content-Type: application/json" \
        -d "{\"identity\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
    
    TOKEN=$(echo "$AUTH_RESPONSE" | jq -r '.token // empty')
    
    if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
        echo "Authentication failed. Proceeding with public access."
        TOKEN=""
    else
        echo "Authenticated successfully."
    fi
elif [ "$#" -ne 0 ]; then
    usage
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Fetching records from $COLLECTION..."
if [ -n "$TOKEN" ]; then
    RECORDS_JSON=$(curl -s -H "Authorization: $TOKEN" "$BASE_URL/api/collections/$COLLECTION/records?perPage=500")
else
    RECORDS_JSON=$(curl -s "$BASE_URL/api/collections/$COLLECTION/records?perPage=500")
fi

if [ $? -ne 0 ] || [ -z "$RECORDS_JSON" ]; then
    echo "Error: Failed to fetch records."
    exit 1
fi

# Check for API error
API_ERROR=$(echo "$RECORDS_JSON" | jq -r '.message // empty')
if [ -n "$API_ERROR" ]; then
    echo "API Error: $API_ERROR"
    exit 1
fi

COUNT=$(echo "$RECORDS_JSON" | jq '.items | length')
echo "Found $COUNT records."

# Process each item
echo "$RECORDS_JSON" | jq -c '.items[]' | while read -r item; do
    NAME=$(echo "$item" | jq -r '.name')
    ID=$(echo "$item" | jq -r '.id')
    
    # Get values from both potential fields
    IMAGE_URL_VAL=$(echo "$item" | jq -r '.image_url // empty')
    IMAGE_FILE_VAL=$(echo "$item" | jq -r '.image // empty')
    
    SOURCE_VAL=""
    IS_FILE_FIELD=false
    
    # Logic: Prioritize file field if it exists, otherwise use image_url
    if [ -n "$IMAGE_FILE_VAL" ] && [ "$IMAGE_FILE_VAL" != "null" ]; then
        SOURCE_VAL="$IMAGE_FILE_VAL"
        IS_FILE_FIELD=true
    elif [ -n "$IMAGE_URL_VAL" ] && [ "$IMAGE_URL_VAL" != "null" ]; then
        SOURCE_VAL="$IMAGE_URL_VAL"
        # If it doesn't look like a URL or path, it might be a filename in the image_url field
        if [[ ! "$SOURCE_VAL" == http* ]] && [[ ! "$SOURCE_VAL" == /* ]]; then
            IS_FILE_FIELD=true
        fi
    fi

    if [ -z "$SOURCE_VAL" ] || [ "$SOURCE_VAL" == "null" ]; then
        echo "[-] Skipping '$NAME' (no image found)"
        continue
    fi

    DOWNLOAD_URL=""
    EXT=""

    if [ "$IS_FILE_FIELD" = true ]; then
        DOWNLOAD_URL="$BASE_URL/api/files/$COLLECTION/$ID/$SOURCE_VAL"
        EXT="${SOURCE_VAL##*.}"
    else
        if [[ "$SOURCE_VAL" == http* ]]; then
            DOWNLOAD_URL="$SOURCE_VAL"
            # Extract extension from URL, removing query strings and anchors
            EXT="${SOURCE_VAL##*.}"
            EXT="${EXT%%\?*}"
            EXT="${EXT%%\#*}"
        else
            # Skip local paths as they aren't on the API
            echo "[!] Skipping '$NAME' (local path: $SOURCE_VAL)"
            continue
        fi
    fi

    # Sanitize extension (e.g. remove long extensions or defaults to jpg)
    # Convert to lowercase
    EXT=$(echo "$EXT" | tr '[:upper:]' '[:lower:]')
    
    if [ ${#EXT} -gt 4 ] || [ -z "$EXT" ] || [[ "$EXT" == */* ]]; then
        EXT="jpg"
    fi

    # Sanitize filename for the filesystem
    # Replaces spaces with underscores and removes special characters
    SAFE_NAME=$(echo "$NAME" | sed 's/[^a-zA-Z0-9 _-]/ /g' | xargs | tr ' ' '_')
    FILENAME="$SAFE_NAME.$EXT"
    
    echo "[+] Downloading '$NAME' -> $FILENAME"
    
    if [ -n "$TOKEN" ]; then
        curl -s -L -H "Authorization: $TOKEN" -o "$OUTPUT_DIR/$FILENAME" "$DOWNLOAD_URL"
    else
        curl -s -L -o "$OUTPUT_DIR/$FILENAME" "$DOWNLOAD_URL"
    fi
done

echo ""
echo "Download complete! Images are stored in the '$OUTPUT_DIR' directory."

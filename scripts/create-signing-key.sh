#!/usr/bin/env bash
# Creates the permanent Android signing key and stores it as GitHub Actions secrets.
#
# Every APK must be signed with the same key, or Android refuses to install an update over the
# old version. Run this once. Needs openssl and an authenticated GitHub CLI (gh auth login).
#
#   bash scripts/create-signing-key.sh
#
# The key and its password are saved outside the repository (KEY_DIR below). Back that folder
# up somewhere safe: if it is lost, no future update can be installed over the existing app.
set -euo pipefail

KEY_DIR="${KEY_DIR:-$HOME/.config/guitar-cheat-sheet-signing}"
ALIAS="guitarcheatsheet"
REPO="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
KEYSTORE="$KEY_DIR/release.p12"

if [ -e "$KEYSTORE" ]; then
  echo "A signing key already exists at $KEYSTORE. Not replacing it."
  echo "Replacing the key would stop updates from installing. Delete it by hand only if you are sure."
  exit 1
fi

mkdir -p "$KEY_DIR"
chmod 700 "$KEY_DIR"
umask 077

# Random password, never printed.
PASSWORD="$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c 32)"
export PASSWORD

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

openssl req -x509 -newkey rsa:4096 -sha256 -days 10000 -nodes \
  -keyout "$TMP/key.pem" -out "$TMP/cert.pem" \
  -subj "/CN=Guitar Cheat Sheet/O=Guitar Cheat Sheet" 2>/dev/null
openssl pkcs12 -export -inkey "$TMP/key.pem" -in "$TMP/cert.pem" \
  -name "$ALIAS" -out "$KEYSTORE" -passout env:PASSWORD
printf '%s\n' "$PASSWORD" > "$KEY_DIR/password.txt"

base64 -w0 "$KEYSTORE" | gh secret set ANDROID_KEYSTORE_BASE64 --repo "$REPO"
printf '%s' "$PASSWORD" | gh secret set ANDROID_KEYSTORE_PASSWORD --repo "$REPO"
printf '%s' "$PASSWORD" | gh secret set ANDROID_KEY_PASSWORD --repo "$REPO"
printf '%s' "$ALIAS" | gh secret set ANDROID_KEY_ALIAS --repo "$REPO"

echo
echo "Signing key created and saved to GitHub secrets for $REPO."
echo "Certificate SHA-256: $(openssl x509 -in "$TMP/cert.pem" -noout -fingerprint -sha256 | cut -d= -f2)"
echo
echo "Back up this folder now (it holds the key and its password): $KEY_DIR"

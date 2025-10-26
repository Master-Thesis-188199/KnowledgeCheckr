#!/usr/bin/env sh
# Accumulate Drizzle migration SQL files into a single init.sql
# Usage: ./compose-init-script.sh [MIGRATIONS_DIR] [OUTPUT_FILE]
# Defaults: MIGRATIONS_DIR=drizzle   OUTPUT_FILE=schema/init.sql

set -eu

MIGRATIONS_DIR="${1:-drizzle}"
OUTPUT_FILE="${2:-schema/init.sql}"

# Ensure output directory exists
OUT_DIR="$(dirname "$OUTPUT_FILE")"
mkdir -p "$OUT_DIR"

# Expand migration files; fail early if none
set -- "$MIGRATIONS_DIR"/*.sql
if [ ! -e "$1" ]; then
  echo "No .sql migration files found in '$MIGRATIONS_DIR'." >&2
  exit 1
fi

# Start a fresh file
: > "$OUTPUT_FILE"

# Optional: add a small header (commented, safe for MySQL)
{
  echo "# ========================================================="
  echo "# Generated init.sql (accumulated from Drizzle migrations)"
  echo "# Source directory: $MIGRATIONS_DIR"
  echo "# Generated at: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  echo "# ========================================================="
  echo
} >> "$OUTPUT_FILE"

# Concatenate in lexicographic order (0000_..., 0001_..., ...)
i=1
for f in "$@"; do
  base="$(basename "$f")"

  {
    echo "# Accumulated migration step $i: '$base'"
    cat "$f"
    echo
    echo
  } >> "$OUTPUT_FILE"

  i=$(( i + 1 ))
done

echo "Wrote $(($i - 1)) migration(s) into '$OUTPUT_FILE'."

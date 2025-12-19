#!/usr/bin/env bash
set -euo pipefail

BUILD="build/previewer"
OUTPUT="build/output"
SRC_PATH=$(realpath apps/previewer)
APP_PATH=$(realpath apps/web)

# Create build folder
rm -rfd "$BUILD"
rm -rfd "$OUTPUT"
mkdir -p "$BUILD"

OUTPUT_PATH=$(realpath "$OUTPUT")

# Copy source
rsync -avh --progress \
  --exclude='node_modules/' \
  --exclude='.*' \
  --exclude='contentlayer.config.ts' \
  --exclude='src/instrumentation*.ts' \
  --exclude='src/sentry.*.config.ts' \
  --exclude='src/app/(developers)' \
  --exclude='src/app/blog' \
  --exclude='src/app/\[locale\]/\(dashboard\)' \
  --exclude='src/app/\[locale\]/\(main\)/about' \
  --exclude='src/app/\[locale\]/\(main\)/browse' \
  --exclude='src/app/\[locale\]/\(main\)/report' \
  --exclude='src/app/\[locale\]/\(main\)/\(developers\)/auth' \
  --exclude='src/app/\[locale\]/\(main\)/\(error\)' \
  --exclude='src/docs' \
  apps/web/ \
  "$BUILD"

rsync -avh --progress \
  --exclude='tsconfig.json' \
  $SRC_PATH/ \
  "$BUILD"

# Override deps
jq --slurpfile root "$APP_PATH/package.json" '
  .dependencies = $root[0].dependencies |
  .devDependencies = $root[0].devDependencies
' "$BUILD/package.json" > "$BUILD/package.json.tmp" && mv "$BUILD/package.json.tmp" "$BUILD/package.json"

# Change app name
cd "$BUILD"
npm pkg set name="@sinytra/wiki-previewer"
# Set app version
VERSION=$(git describe --tags --long --match "v[0-9]*.[0-9]*" | sed -E 's/^v?([0-9]+\.[0-9]+)\.[0-9]+-([0-9]+)-g.*/\1.\2/')

echo "Detected version: $VERSION"
npm pkg set version="$VERSION"
npm pkg set scripts.build="next build"

# Install
pnpm install

# Build
pnpm run build

# Grab output
cp -a public ".next/standalone/$BUILD/"
cp -a .next/static ".next/standalone/$BUILD/.next/"
cp -a ".next/standalone/$BUILD" "$OUTPUT_PATH"
cp -a "$SRC_PATH/bin" "$OUTPUT_PATH"

# Filter dependencies
cd "$OUTPUT_PATH"
DEPS_TO_COPY='["concurrently", "chokidar", "ws", "next", "react", "react-dom", "require-in-the-middle", "import-in-the-middle"]'

# Filter production dependencies
jq --argjson list "$DEPS_TO_COPY" --slurpfile src "$APP_PATH/package.json" '
  .dependencies = (
    $src[0].dependencies
    | with_entries(select(.key as $k | $list | index($k)))
  ) | del(.devDependencies) | del(.scripts)
' package.json > package.json.tmp && mv package.json.tmp package.json

# Add production dependencies from apps/previewer
jq --argjson list "$DEPS_TO_COPY" --slurpfile src "$SRC_PATH/package.json" '
  .dependencies += (
    $src[0].dependencies
    | with_entries(select(.key as $k | $list | index($k)))
  )
' package.json > package.json.tmp && mv package.json.tmp package.json

#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 <source-image> <slug> [--force]" >&2
  exit 2
}

[[ $# -eq 2 || $# -eq 3 ]] || usage

source_image=$1
slug=$2
force=${3:-}

[[ -f "$source_image" ]] || { echo "Source image not found: $source_image" >&2; exit 1; }
[[ "$slug" =~ ^[a-z0-9][a-z0-9-]*$ ]] || { echo "Slug must use lowercase letters, digits, and hyphens" >&2; exit 1; }
[[ -z "$force" || "$force" == "--force" ]] || usage

command -v ffmpeg >/dev/null || { echo "ffmpeg is required" >&2; exit 1; }
command -v ffprobe >/dev/null || { echo "ffprobe is required" >&2; exit 1; }

repo_root=$(git rev-parse --show-toplevel)
output_dir="$repo_root/backups/cdn-images/covers"
output_file="$output_dir/$slug.webp"

if [[ -e "$output_file" && "$force" != "--force" ]]; then
  echo "Output already exists: $output_file (pass --force to replace it)" >&2
  exit 1
fi

mkdir -p "$output_dir"
temp_dir=$(mktemp -d)
trap 'rm -rf -- "$temp_dir"' EXIT
temp_file="$temp_dir/cover.webp"

encode() {
  local quality=$1
  ffmpeg -hide_banner -loglevel error -y \
    -i "$source_image" \
    -vf "scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630" \
    -frames:v 1 \
    -c:v libwebp \
    -quality "$quality" \
    -compression_level 6 \
    -preset picture \
    "$temp_file"
}

file_size() {
  stat -f%z "$1" 2>/dev/null || stat -c%s "$1"
}

encode 78
size=$(file_size "$temp_file")

if (( size > 204800 )); then
  encode 72
  size=$(file_size "$temp_file")
fi

if (( size > 204800 )); then
  echo "Encoded cover still exceeds 200 KB: $size bytes" >&2
  exit 1
fi

dimensions=$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height -of csv=s=x:p=0 "$temp_file")
[[ "$dimensions" == "1200x630" ]] || { echo "Unexpected dimensions: $dimensions" >&2; exit 1; }

mv "$temp_file" "$output_file"
echo "$output_file"
echo "dimensions=$dimensions bytes=$size"

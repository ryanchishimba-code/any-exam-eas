#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=ensure-database-url.sh
source "$DIR/ensure-database-url.sh"

npx prisma generate
